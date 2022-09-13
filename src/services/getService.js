import httpRequest from '~/utils/httpRequest';

export const getPage = async (page) => {
    try {
        const result = await httpRequest.get('danh-sach/phim-moi-cap-nhat', {
            params: {
                page: page,
            },
        });

        return result.data;
    } catch (error) {
        console.log(error);
    }
};

export const getMovie = async (slug) => {
    try {
        const result = await httpRequest.get(`phim/${slug}`, {});

        return result.data;
    } catch (error) {
        console.log(error);
    }
};
