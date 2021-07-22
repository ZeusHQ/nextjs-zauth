import { withApiAuthRequired, getAccessToken } from '@zeushq/nextjs-zauth';

export default withApiAuthRequired(async function shows(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res, {
            scopes: ['read:shows']
        });

        const baseURL =
            process.env.ZAUTH_BASE_URL?.indexOf('http') === 0
                ? process.env.ZAUTH_BASE_URL
                : `https://${process.env.ZAUTH_BASE_URL}`;

        // This is a contrived example, normally your external API would exist on another domain.
        const response = await fetch(baseURL + '/api/my/shows', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const shows = await response.json();
        res.status(response.status || 200).json(shows);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            code: error.code,
            error: error.message
        });
    }
});