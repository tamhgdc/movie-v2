import { useState, useEffect, useRef, useContext } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { findDOMNode } from 'react-dom';

import styles from './Video.module.scss';
import {
    FullScreenIcon,
    PlayIcon,
    SettingIcon,
    PauseIcon,
    VolumeUpIcon,
    VolumeDownIcon,
    VolumeMuteIcon,
    SeekNextIcon,
    SeekPrevIcon,
    NextIcon,
    CheckIconFill,
    CloseIcon,
} from '~/components/icons';
import MenuSetting from './MenuSetting';
import { EpisodeContext } from '~/store/EpisodeContext';
import { MovieContext } from '~/store/MovieContext';

const cx = classNames.bind(styles);

const formatTime = (seconds) => {
    let result = '';

    const hh = Math.floor(seconds / 3600);

    const mm = Math.floor((seconds - hh * 3600) / 60);

    const ss = Math.floor(seconds - hh * 3600 - mm * 60);

    if (hh > 0) {
        result += hh + ':';
    }

    if (mm > 0 && mm < 10) {
        result += '0' + mm + ':';
    } else {
        result += mm + ':';
    }

    if (ss < 10) {
        result += '0' + ss;
    } else {
        result += ss;
    }

    return result;
};

function Video() {
    const movieContext = useContext(MovieContext);
    const episodeContext = useContext(EpisodeContext);

    // Refs
    const videoRef = useRef();

    const toolTipFullScreenRef = useRef();

    const toolTipTimeProcessRef = useRef();

    const currentTimeRef = useRef(); // Element thời gian đang phát 0:00

    const durationTimeRef = useRef(); // Element thời lượng video

    const nextEpisodeBtnRef = useRef();

    // DAD: Drag and Drop
    const isDADVolume = useRef();
    const isDADTime = useRef();

    const videoVolumeCurrent = useRef(1);

    const isHoverVolumeIcon = useRef();

    const isFocusVideo = useRef();

    const isPlayingVideo = useRef();

    const loadedSecond = useRef(0);

    const startAtVideo = useRef();

    const endAtVideo = useRef();

    const isAutoTransferEpisode = useRef();

    const [props, setProps] = useState({
        playing: true,
        volume: videoVolumeCurrent.current,
        muted: false,
        playbackRate: 1,
        style: {
            display: 'flex',
        },
    });

    useEffect(() => {
        const videoWrapper = document.querySelector(`.${cx('wrapper')}`);

        // Kéo thả âm lượng, thời gian video
        // ---- Start -----
        const volumeProcessWrapper = document.querySelector(`.${cx('process__volume__wrapper')}`);
        const timeProcessWrapper = document.querySelector(`.${cx('process__time__wrapper')}`);

        const currentVolume = volumeProcessWrapper.firstChild.firstChild; // thanh tiến trình volume
        const currentTime = timeProcessWrapper.firstChild.lastChild; // thanh tiến trình thời gian video

        let volumeBounding;
        let timeBounding;

        let percentVolumeProcess;
        let percentTimeProcess;

        let isMouseDownVolume = false;
        let isMouseDownTime = false;

        let minProcessVolume;
        let maxProcessVolume;

        let minProcessTime;
        let maxProcessTime;

        let seekTimeSeconds;

        const handleMouseDownVolume = (e) => {
            isDADVolume.current = true;

            volumeBounding = volumeProcessWrapper.firstChild.getBoundingClientRect();
            minProcessVolume = volumeBounding.left;
            maxProcessVolume = volumeBounding.width + minProcessVolume;

            percentVolumeProcess = (e.clientX - volumeBounding.left) / volumeBounding.width;
            currentVolume.style.width = percentVolumeProcess * 100 + '%';

            videoVolumeCurrent.current = percentVolumeProcess;

            isMouseDownVolume = true;
        };

        const handleMouseDownTime = (e) => {
            isDADTime.current = true;

            timeBounding = timeProcessWrapper.firstChild.getBoundingClientRect();
            minProcessTime = timeBounding.left;
            maxProcessTime = timeBounding.width + minProcessTime;

            percentTimeProcess = (e.clientX - timeBounding.left) / timeBounding.width;
            currentTime.style.width = percentTimeProcess * 100 + '%';

            seekTimeSeconds = percentTimeProcess * videoRef.current.getDuration();
            currentTimeRef.current.textContent = formatTime(seekTimeSeconds);

            isMouseDownTime = true;
        };

        const handleMouseMove = (e) => {
            if (isMouseDownVolume && e.clientX >= minProcessVolume && e.clientX <= maxProcessVolume) {
                percentVolumeProcess = (e.clientX - volumeBounding.left) / volumeBounding.width;

                if (percentVolumeProcess < 0) {
                    percentVolumeProcess = 0;
                }

                currentVolume.style.width = percentVolumeProcess * 100 + '%';

                videoVolumeCurrent.current = percentVolumeProcess;

                setProps((prev) => ({
                    ...prev,
                    volume: percentVolumeProcess,
                }));
            }
            if (isMouseDownTime && e.clientX >= minProcessTime && e.clientX <= maxProcessTime) {
                percentTimeProcess = (e.clientX - timeBounding.left) / timeBounding.width;
                currentTime.style.width = percentTimeProcess * 100 + '%';

                seekTimeSeconds = percentTimeProcess * videoRef.current.getDuration();
                currentTimeRef.current.textContent = formatTime(seekTimeSeconds);
            }
        };

        const handleMouseUp = () => {
            if (isMouseDownVolume) {
                setProps((prev) => ({
                    ...prev,
                    volume: percentVolumeProcess,
                }));

                isDADVolume.current = false;
                isMouseDownVolume = false;
                if (!isHoverVolumeIcon.current) {
                    volumeIconElm.classList.remove(cx('show'));
                }
            }
            if (isMouseDownTime) {
                if (!isPlayingVideo.current && seekTimeSeconds >= loadedSecond.current) {
                    // Hiện loading
                    let wrapperElm = document.querySelector(`.${cx('wrapper')}`);
                    if (!wrapperElm.className.includes(cx('loading'))) {
                        wrapperElm.classList.add(cx('loading'));
                    }
                }

                videoRef.current.seekTo(seekTimeSeconds);
                isDADTime.current = false;
                isMouseDownTime = false;
            }
        };

        volumeProcessWrapper.addEventListener('mousedown', handleMouseDownVolume);
        timeProcessWrapper.addEventListener('mousedown', handleMouseDownTime);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        // ---- End -----

        // Sự kiện bàn phím
        // ---- Start -----
        const videoIconWrapper = document.querySelector(`.${cx('video__icons__wrapper')}`);

        const volumeEvent = document.querySelector(`.${cx('video__volume__event')}`);

        const indexVolumeMuted = 0;
        const indexVolumeDown = 1;
        const indexVolumeUp = 2;
        const indexSeekPrev = 3;
        const indexSeekNext = 4;

        let indexPrevIcon = 0;

        let handler = setTimeout(() => {}, 0);
        let delayAnimate = setTimeout(() => {}, 0);

        const animate = (index, location) => {
            if (location === 'center') {
                videoIconWrapper.classList.add(cx('icons__center'));
                videoIconWrapper.classList.remove(cx('icons__left'));
                videoIconWrapper.classList.remove(cx('icons__right'));
            } else if (location === 'left') {
                videoIconWrapper.classList.add(cx('icons__left'));
                videoIconWrapper.classList.remove(cx('icons__center'));
                videoIconWrapper.classList.remove(cx('icons__right'));
            } else {
                videoIconWrapper.classList.add(cx('icons__right'));
                videoIconWrapper.classList.remove(cx('icons__center'));
                videoIconWrapper.classList.remove(cx('icons__left'));
            }

            if (videoIconWrapper.style.display.includes('block')) {
                clearTimeout(handler);
                videoIconWrapper.style.display = 'none';
                videoIconWrapper.childNodes[indexPrevIcon].style.display = 'none';
                if (volumeEvent.style.display === 'block') {
                    volumeEvent.style.display = 'none';
                }

                delayAnimate = setTimeout(() => {
                    videoIconWrapper.style.display = 'block';
                    videoIconWrapper.childNodes[index].style.display = 'block';
                    indexPrevIcon = index;

                    if (index === 1 || index === 2) {
                        volumeEvent.style.display = 'block';
                    }
                }, 100);
            } else {
                videoIconWrapper.style.display = 'block';
                videoIconWrapper.childNodes[index].style.display = 'block';
                indexPrevIcon = index;

                if (index === 1 || index === 2) {
                    volumeEvent.style.display = 'block';
                }
            }

            handler = setTimeout(() => {
                videoIconWrapper.style.display = 'none';
                videoIconWrapper.childNodes[index].style.display = 'none';

                if (volumeEvent.style.display === 'block') {
                    volumeEvent.style.display = 'none';
                }
            }, 400);
        };

        const handleFocusVideo = (e) => {
            if (videoWrapper.contains(e.target)) {
                isFocusVideo.current = true;
            } else {
                isFocusVideo.current = false;
            }
        };

        document.addEventListener('click', handleFocusVideo);

        const handleKeyDown = (e) => {
            switch (e.keyCode) {
                case 37: {
                    if (isFocusVideo.current && videoRef.current.getDuration()) {
                        e.preventDefault();

                        animate(indexSeekPrev, 'left');

                        seekTimeSeconds = videoRef.current.getCurrentTime() - 30;

                        if (seekTimeSeconds < 0) {
                            seekTimeSeconds = 0;
                        }

                        videoRef.current.seekTo(seekTimeSeconds);

                        percentTimeProcess = seekTimeSeconds / videoRef.current.getDuration();
                        currentTime.style.width = percentTimeProcess * 100 + '%';
                        currentTimeRef.current.textContent = formatTime(seekTimeSeconds);
                    }
                    break;
                }
                case 38: {
                    if (isFocusVideo.current && videoRef.current.getDuration()) {
                        e.preventDefault();
                        setProps((prev) => {
                            animate(indexVolumeUp, 'center');

                            videoVolumeCurrent.current = prev.volume + 0.05 > 1 ? 1 : prev.volume + 0.05;

                            percentVolumeProcess = videoVolumeCurrent.current;
                            currentVolume.style.width = percentVolumeProcess * 100 + '%';

                            return {
                                ...prev,
                                volume: prev.volume + 0.05 > 1 ? 1 : prev.volume + 0.05,
                            };
                        });
                    }
                    break;
                }
                case 39: {
                    if (isFocusVideo.current && videoRef.current.getDuration()) {
                        e.preventDefault();

                        animate(indexSeekNext, 'right');

                        let seekTimeSeconds = videoRef.current.getCurrentTime() + 30;

                        if (seekTimeSeconds > videoRef.current.getDuration()) {
                            seekTimeSeconds = videoRef.current.getDuration();
                        }

                        videoRef.current.seekTo(seekTimeSeconds);

                        percentTimeProcess = seekTimeSeconds / videoRef.current.getDuration();
                        currentTime.style.width = percentTimeProcess * 100 + '%';
                        currentTimeRef.current.textContent = formatTime(seekTimeSeconds);
                    }
                    break;
                }
                case 40: {
                    if (isFocusVideo.current && videoRef.current.getDuration()) {
                        e.preventDefault();
                        setProps((prev) => {
                            animate(indexVolumeDown, 'center');

                            videoVolumeCurrent.current = prev.volume - 0.05 < 0 ? 0 : prev.volume - 0.05;

                            percentVolumeProcess = videoVolumeCurrent.current;
                            currentVolume.style.width = percentVolumeProcess * 100 + '%';

                            return {
                                ...prev,
                                volume: prev.volume - 0.05 < 0 ? 0 : prev.volume - 0.05,
                            };
                        });
                    }
                    break;
                }
                case 77: {
                    handleVolumeMuted(); // ấn m để bật/tắt âm lượng
                    break;
                }
                case 75: {
                    handlePlayPause(); // ấn k để play/pause video
                    break;
                }
                case 70: {
                    handleClickFullscreen(); // ấn f để full screen
                    break;
                }
                case 76: {
                    // Ấn l để chuyển tập tiếp theo
                    nextEpisodeBtnRef.current.click();
                    break;
                }
                default:
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        // ---- End ------

        // Sự kiện hover vào icon volume, click
        // ---- Start ----
        const volumeIconElm = document.getElementsByClassName(`${cx('volume__control')}`)[0];

        const handleMouseOverVolume = () => {
            isHoverVolumeIcon.current = true;
            if (!volumeIconElm.className.includes(cx('show'))) {
                volumeIconElm.classList.add(cx('show'));
            }
        };

        const handleMouseLeaveVolume = () => {
            isHoverVolumeIcon.current = false;
            if (!isDADVolume.current && volumeIconElm.className.includes(cx('show'))) {
                volumeIconElm.classList.remove(cx('show'));
            }
        };

        const handleVolumeMuted = (e) => {
            e.stopPropagation();

            setProps((prev) => {
                if (prev.muted) {
                    if (videoVolumeCurrent.current > 0.3) {
                        animate(indexVolumeUp, 'center');
                    } else {
                        animate(indexVolumeDown, 'center');
                    }
                    currentVolume.style.width = videoVolumeCurrent.current * 100 + '%';
                } else {
                    animate(indexVolumeMuted, 'center');
                    currentVolume.style.width = '0%';
                }

                return {
                    ...prev,
                    volume: prev.muted ? videoVolumeCurrent.current : 0,
                    muted: !prev.muted,
                };
            });
        };

        const handleVolumeStopPropagation = (e) => {
            e.stopPropagation();
        };

        volumeIconElm.addEventListener('mouseover', handleMouseOverVolume);
        volumeIconElm.addEventListener('mouseleave', handleMouseLeaveVolume);
        volumeIconElm.addEventListener('click', handleVolumeMuted);
        volumeProcessWrapper.addEventListener('click', handleVolumeStopPropagation);
        // ---- End -----

        // Mouse move trên video wrapper -> ở chế độ fullscreen ẩn controls sau 1 khoảng thời gian
        // ---- Start -----
        const controlsElm = document.querySelector(`.${cx('controls')}`);
        let timeoutHideControls = setTimeout(() => {}, 0);
        const delay = 3500;

        let isFullscreen = false;

        const hideControls = () => {
            clearTimeout(timeoutHideControls);

            timeoutHideControls = setTimeout(() => {
                if (isFullscreen) {
                    videoWrapper.style.cursor = 'none';
                    controlsElm.style.display = 'none';
                }
            }, delay);
        };

        const handleMouseMoveVideo = () => {
            if (isFullscreen) {
                hideControls();
            }

            if (controlsElm.style.display === 'none') {
                controlsElm.style.display = 'flex';
            }

            if (videoWrapper.style.cursor === 'none') {
                videoWrapper.style.cursor = 'unset';
            }
        };

        const handleFullscreenChange = () => {
            if (document.fullscreenElement) {
                isFullscreen = true;
                toolTipFullScreenRef.current.textContent = 'Thoát khỏi chế độ toàn màn hình (f)';
            } else {
                isFullscreen = false;
                toolTipFullScreenRef.current.textContent = 'Toàn màn hình (f)';
            }
        };

        videoWrapper.addEventListener('mousemove', handleMouseMoveVideo);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        // ---- End ------

        // Click vào video -> play/pause
        // ---- Start
        const determinedClickVideo = (e) => {
            if (!controlsElm.contains(e.target)) {
                handlePlayPause();
            }
        };

        videoWrapper.addEventListener('click', determinedClickVideo);
        // ---- End ------

        // Di chuyển trên timeProcess -> hiện thời gian
        // ---- Start -----
        const handleMouseMoveTimeProcess = (e) => {
            if (videoRef.current.getDuration()) {
                if (toolTipTimeProcessRef.current.style.display === 'none') {
                    toolTipTimeProcessRef.current.removeAttribute('style');
                }

                timeBounding = timeProcessWrapper.getBoundingClientRect();
                toolTipTimeProcessRef.current.style.left = e.clientX - timeBounding.left + 'px';

                let secondPointMove =
                    ((e.clientX - timeBounding.left) / timeBounding.width) * videoRef.current.getDuration();
                toolTipTimeProcessRef.current.textContent = formatTime(secondPointMove);
            } else {
                if (toolTipTimeProcessRef.current.style.display !== 'none') {
                    toolTipTimeProcessRef.current.style.display = 'none';
                }
            }
        };

        timeProcessWrapper.addEventListener('mousemove', handleMouseMoveTimeProcess);
        // ---- End ------

        // Change playbackRate
        // --- Start -----
        const optionPlaybackRates = document.querySelectorAll(
            `.${cx('item__setting')}[data-type="playbackRate"][data-parent]`,
        );

        const handleChangePlaybackRate = (e) => {
            let clickElement = e.target;

            (() => {
                while (!clickElement.className.includes(cx('item__setting'))) {
                    clickElement = clickElement.parentElement;
                }
            })();

            let playbackRate = clickElement.firstChild.lastChild.textContent;

            if (playbackRate === 'Chuẩn') {
                playbackRate = '1';
            }

            setProps((prev) => ({
                ...prev,
                playbackRate: parseFloat(playbackRate),
            }));
        };

        optionPlaybackRates.forEach((option) => {
            option.addEventListener('click', handleChangePlaybackRate);
        });
        // ---- End -----

        // Submit form auto transfer episode
        // ---- Start -----
        const formAutoTransferEpisode = document.querySelector('#autoTransferEpisode');

        const submitFormBtn = formAutoTransferEpisode.querySelector(`.${cx('item__btn')}`);

        const notificationSuccess = document.querySelector(`.${cx('save__data_autoEpisode')}`);

        let startAtMinute;
        let startAtSecond;
        let endAtMinute;
        let endAtSecond;

        let handlerSaveDataForm = setTimeout(() => {}, 0);

        const handleSubmitFormAutoTransferEpisode = () => {
            const formData = new FormData(formAutoTransferEpisode);

            for (const [key, value] of formData) {
                switch (key) {
                    case 'startAtMinute': {
                        startAtMinute = parseInt(value) || 0;
                        break;
                    }
                    case 'startAtSecond': {
                        startAtSecond = parseInt(value) || 0;
                        break;
                    }
                    case 'endAtMinute': {
                        endAtMinute = parseInt(value) || 0;
                        break;
                    }
                    case 'endAtSecond': {
                        endAtSecond = parseInt(value) || 0;
                        break;
                    }
                    default:
                        break;
                }
            }

            startAtVideo.current = startAtMinute * 60 + startAtSecond;
            endAtVideo.current = endAtMinute * 60 + endAtSecond;

            notificationSuccess.style.display = 'flex';

            handlerSaveDataForm = setTimeout(() => {
                notificationSuccess.style.display = 'none';
            }, 2000);
        };

        submitFormBtn.addEventListener('click', handleSubmitFormAutoTransferEpisode);
        // ---- End -----

        // handleOnChange input autoTransferEpisode
        // ---- Start -----
        const inputAutoTransferEpisode = document.querySelector(`#${cx('inputAutoTransferEpisode')}`);

        const handleIsAutoTransferEpisode = () => {
            isAutoTransferEpisode.current = inputAutoTransferEpisode.checked;
        };

        inputAutoTransferEpisode.addEventListener('change', handleIsAutoTransferEpisode);
        // ---- End -----

        return () => {
            volumeProcessWrapper.removeEventListener('mousedown', handleMouseDownVolume);
            timeProcessWrapper.removeEventListener('mousedown', handleMouseDownTime);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            document.removeEventListener('click', handleFocusVideo);
            document.removeEventListener('keydown', handleKeyDown);

            volumeIconElm.removeEventListener('mouseover', handleMouseOverVolume);
            volumeIconElm.removeEventListener('mouseleave', handleMouseLeaveVolume);
            volumeIconElm.removeEventListener('click', handleVolumeMuted);
            volumeProcessWrapper.removeEventListener('click', handleVolumeStopPropagation);

            clearTimeout(handler);
            clearTimeout(delayAnimate);
            clearTimeout(timeoutHideControls);

            videoWrapper.removeEventListener('mousemove', handleMouseMoveVideo);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);

            videoWrapper.removeEventListener('click', determinedClickVideo);

            timeProcessWrapper.removeEventListener('mousemove', handleMouseMoveTimeProcess);

            optionPlaybackRates.forEach((option) => {
                option.removeEventListener('click', handleChangePlaybackRate);
            });

            submitFormBtn.removeEventListener('click', handleSubmitFormAutoTransferEpisode);
            clearTimeout(handlerSaveDataForm);

            inputAutoTransferEpisode.removeEventListener('change', handleIsAutoTransferEpisode);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Reset process thời lượng video
        if (!videoRef.current.getDuration()) {
            durationTimeRef.current.textContent = '00:00';

            currentTimeRef.current.textContent = '0:00';
            document.querySelector(`.${cx('process__played')}`).style.width = '0%';

            document.querySelector(`.${cx('process__loaded')}`).style.width = '0%';

            loadedSecond.current = 0;

            // Hiện loading
            const wrapperElm = document.querySelector(`.${cx('wrapper')}`);
            if (!wrapperElm.className.includes(cx('loading'))) {
                wrapperElm.classList.add(cx('loading'));
            }

            if (!wrapperElm.className.includes(cx('loading-src'))) {
                wrapperElm.classList.add(cx('loading-src'));
            }
        }
    }, [episodeContext.episode]);

    const handlePlayPause = () => {
        setProps((prev) => {
            isPlayingVideo.current = !prev.playing;

            return {
                ...prev,
                playing: !prev.playing,
            };
        });
    };

    const handleOnProgress = ({ played, playedSeconds, loaded, loadedSeconds }) => {
        loadedSecond.current = loadedSeconds;

        if (videoRef.current.getDuration() && durationTimeRef.current.innerText === '00:00') {
            durationTimeRef.current.textContent = formatTime(videoRef.current.getDuration());
        }

        // Nếu đang kéo thả thì không cập nhật
        if (!isDADTime.current) {
            currentTimeRef.current.textContent = formatTime(playedSeconds);
            document.querySelector(`.${cx('process__played')}`).style.width = played * 100 + '%';
        }

        document.querySelector(`.${cx('process__loaded')}`).style.width = loaded * 100 + '%';

        if (isAutoTransferEpisode.current) {
            if (playedSeconds >= endAtVideo.current) {
                nextEpisodeBtnRef.current.click();

                if (!nextEpisodeBtnRef.current.hasAttribute('href')) {
                    document.getElementById(cx('inputAutoTransferEpisode')).checked = false;
                    isAutoTransferEpisode.current = false;
                }
            }
        }

        if (!isPlayingVideo.current) {
            // Ẩn loading
            let wrapperElm = document.querySelector(`.${cx('wrapper')}`);
            if (wrapperElm.className.includes(cx('loading'))) {
                wrapperElm.classList.remove(cx('loading'));
            }
        }
    };

    const handleClickFullscreen = () => {
        if (screenfull.isEnabled) {
            if (!screenfull.isFullscreen) {
                const videoContent = document.querySelector(`.${cx('content')}`);
                screenfull.request(videoContent);

                isFocusVideo.current = true;
            } else {
                screenfull.exit();
            }
        }
    };

    const handleOnBuffer = () => {
        // Hiện loading
        let wrapperElm = document.querySelector(`.${cx('wrapper')}`);
        if (!wrapperElm.className.includes(cx('loading'))) {
            wrapperElm.classList.add(cx('loading'));
        }
    };

    const handleOnBufferEnd = () => {
        // Ẩn loading src
        const wrapperElm = document.querySelector(`.${cx('wrapper')}`);
        if (wrapperElm.className.includes(cx('loading'))) {
            wrapperElm.classList.remove(cx('loading'));
        }

        if (wrapperElm.className.includes(cx('loading-src'))) {
            wrapperElm.classList.remove(cx('loading-src'));
        }
    };

    const handleOnStart = () => {
        if (isAutoTransferEpisode.current) {
            if (startAtVideo.current) {
                videoRef.current.seekTo(startAtVideo.current);

                currentTimeRef.current.textContent = formatTime(startAtVideo.current);
            }
        }
    };

    const handleOnEnded = () => {
        if (isAutoTransferEpisode.current) {
            if (!endAtVideo.current) {
                nextEpisodeBtnRef.current.click();
                if (!nextEpisodeBtnRef.current.hasAttribute('href')) {
                    document.getElementById(cx('inputAutoTransferEpisode')).checked = false;

                    setProps((prev) => ({
                        ...prev,
                        playing: false,
                    }));
                }
            }
        } else {
            setProps((prev) => ({
                ...prev,
                playing: false,
            }));
        }
    };

    const handleShowSettingMenu = (e) => {
        e.stopPropagation();

        const menuSetting = document.querySelector(`.${cx('menu__setting')}`);
        const toolTipSetting = document.querySelector(`.${cx('tooltips__setting')}`);

        if (menuSetting.style.display === 'none') {
            menuSetting.style.display = 'block';
            toolTipSetting.style.display = 'none';
        } else {
            toolTipSetting.removeAttribute('style');
            menuSetting.style.display = 'none';
        }
    };

    return (
        <div className={cx('wrapper', 'loading', 'loading-src')}>
            <div className={cx('content')}>
                <div className={cx('overlay')}>
                    <div className={cx('video__loading')}></div>
                </div>
                <div className={cx('video__icons__wrapper')}>
                    <VolumeMuteIcon className={cx('video__icons')} />
                    <VolumeDownIcon className={cx('video__icons')} />
                    <VolumeUpIcon className={cx('video__icons')} />
                    <SeekPrevIcon className={cx('video__icons')} />
                    <SeekNextIcon className={cx('video__icons')} />
                </div>
                <div className={cx('video__volume__event')}>{(props.volume * 100).toFixed(0) + '%'}</div>
                <div className={cx('save__data_autoEpisode')}>
                    <CheckIconFill className={cx('iconCheck--fill')} width="2.4rem" height="2.4rem" />
                    Lưu dữ liệu thành công
                </div>
                <div className={cx('notification__lastEpisode')}>
                    <CloseIcon className={cx('icon--fillRed')} width="2.4rem" height="2.4rem" />
                    Bạn hiện đang ở tập cuối cùng!
                </div>

                <div className={cx('video__wrapper')}>
                    <ReactPlayer
                        ref={videoRef}
                        url={movieContext.dataMovie.episodes[0].server_data[episodeContext.episode].link_m3u8}
                        width="100%"
                        height="100%"
                        {...props}
                        onStart={handleOnStart}
                        onProgress={handleOnProgress}
                        onBuffer={handleOnBuffer}
                        onBufferEnd={handleOnBufferEnd}
                        onEnded={handleOnEnded}
                    />
                </div>
                <div className={cx('controls')}>
                    <div className={cx('controls__left')}>
                        {props.playing ? (
                            <div onClick={handlePlayPause} className={cx('controls__icon')}>
                                <PauseIcon />
                                <div className={cx('tooltips', 'tooltips--left')}>Tạm dừng (k)</div>
                            </div>
                        ) : (
                            <div onClick={handlePlayPause} className={cx('controls__icon')}>
                                <PlayIcon />
                                <div className={cx('tooltips', 'tooltips--left')}>Phát (k)</div>
                            </div>
                        )}
                        {(() => {
                            let Comp = 'div';

                            let props = {};

                            const currentEpisode = episodeContext.episode;

                            const nextEpisode = currentEpisode + 1;

                            const movie = movieContext.dataMovie.movie;

                            if (movieContext.dataMovie.episodes[0].server_data.length > nextEpisode) {
                                const nextEpisodeDetails = movieContext.dataMovie.episodes[0].server_data[nextEpisode];

                                if (nextEpisodeDetails.link_m3u8) {
                                    Comp = Link;
                                    props.to = '/xem-phim/' + movie.slug + '-tap-' + nextEpisodeDetails.slug;

                                    props.onClick = () => {
                                        episodeContext.handleSetEpisode(
                                            movie._id,
                                            movie.name,
                                            episodeContext.episode + 1,
                                        );
                                    };
                                }
                            }

                            if (Comp === 'div') {
                                props.onClick = () => {
                                    const notificationLastEpisode = document.querySelector(
                                        `.${cx('notification__lastEpisode')}`,
                                    );

                                    notificationLastEpisode.style.display = 'flex';

                                    setTimeout(() => {
                                        if (findDOMNode(notificationLastEpisode)) {
                                            notificationLastEpisode.style.display = 'none';
                                        }
                                    }, 2000);
                                };
                            }

                            return (
                                <Comp className={cx('controls__icon')} {...props} ref={nextEpisodeBtnRef}>
                                    <NextIcon height="2.2rem" width="2.2rem" />
                                    <div className={cx('tooltips', 'tooltips--center')}>Tập tiếp theo (l)</div>
                                </Comp>
                            );
                        })()}

                        <div className={cx('controls__icon', 'volume__control')}>
                            {props.volume + 0.001 >= 0.5 ? (
                                <VolumeUpIcon />
                            ) : props.volume > 0 ? (
                                <VolumeDownIcon />
                            ) : (
                                <VolumeMuteIcon />
                            )}
                            <div className={cx('process__volume__wrapper')}>
                                <div className={cx('process__volume')}>
                                    <p className={cx('volume__current')}></p>
                                </div>
                            </div>
                            <div className={cx('tooltips', 'tooltips--center')}>
                                {props.muted ? 'Bật âm thanh (m)' : 'Tắt tiếng (m)'}
                            </div>
                        </div>
                        <div className={cx('video__time')}>
                            <span ref={currentTimeRef}>0:00</span>
                            <span style={{ padding: '0 2px' }}>/</span>
                            <span ref={durationTimeRef}>00:00</span>
                        </div>
                    </div>
                    <div className={cx('controls__right')}>
                        <label htmlFor={cx('inputAutoTransferEpisode')} className={cx('label__auto', 'controls__icon')}>
                            <input id={cx('inputAutoTransferEpisode')} type="checkbox" style={{ display: 'none' }} />
                            <div className={cx('input__checkbox--custom')}></div>
                            <div className={cx('tooltips', 'tooltips--center')}>Tự động chuyển tập tiếp theo</div>
                        </label>
                        <div className={cx('controls__icon')} onClick={handleShowSettingMenu}>
                            <SettingIcon />
                            <div className={cx('tooltips', 'tooltips--center', 'tooltips__setting')}>Cài đặt</div>
                        </div>
                        <MenuSetting />
                        <div onClick={handleClickFullscreen} className={cx('controls__icon')}>
                            <FullScreenIcon />
                            <div ref={toolTipFullScreenRef} className={cx('tooltips', 'tooltips--right')}>
                                Toàn màn hình (f)
                            </div>
                        </div>
                    </div>
                    <div className={cx('process__time__wrapper')}>
                        <div className={cx('time__process')}>
                            <p className={cx('process__loaded')}></p>
                            <p className={cx('process__played')}></p>
                        </div>
                        <div ref={toolTipTimeProcessRef} className={cx('tooltips', 'tooltips--center')}>
                            00:00
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Video;
