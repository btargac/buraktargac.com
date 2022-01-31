const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

// create and init reCAPTCHA client
const client = new RecaptchaEnterpriseServiceClient({
    credentials: {
        client_email: process.env.GOOGLE_RECAPTCHA_EMAIL,
        // https://github.com/auth0/node-jsonwebtoken/issues/642#issuecomment-585173594
        private_key: process.env.GOOGLE_RECAPTCHA_PRIVATE_KEY.replace(/\\n/gm, '\n')
    },
    projectId: process.env.GOOGLE_RECAPTCHA_PROJECT_ID,
});

let routeRecaptcha = async (req, res) => {
    const expectedAction = req.body.action;

    if (!req.body.token) {
        return res.status(500).end();
    }

    const request = {
        assessment: {
            event: {
                token: req.body.token,
                siteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
                expectedAction: expectedAction
            }
        },
        parent: client.projectPath(process.env.GOOGLE_RECAPTCHA_PROJECT_ID)
    };

    try {
        const response = await client.createAssessment(request);

        if (response.tokenProperties?.valid === false) {
            console.log('response', response);
            console.error('invalid reason: response.tokenProperties.invalidReason');
            res.status(500).json({error: response.tokenProperties.invalidReason});
        } else {
            if (response.event.expectedAction === expectedAction) {
                if (parseFloat(response.riskAnalysis.score) >= 0.7) {
                    // successful captcha, run any code you want here now and send 200 response
                    res.json({status: 'success'});
                } else {
                    // send 400 response and possibly reason: response.riskAnalysis.reasons
                    res.status(400).json({error: response.riskAnalysis.reasons});
                }
            } else {
                // send 400 response
                res.status(400).end();
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error});
    }
};

module.exports = routeRecaptcha;