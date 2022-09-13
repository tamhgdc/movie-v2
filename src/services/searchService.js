import httpRequest from '~/utils/httpRequest';

export const searchKeyWord = async (keyword) => {
    try {
        keyword = keyword.replace(' ', '+');
        const urlRequest = `tim-kiem?keyword=${keyword}`;
        const result = await httpRequest.get(urlRequest, {});

        console.log(result);

        return result.data;
    } catch (error) {
        console.log(error);
    }
};
