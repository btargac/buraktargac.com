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
        const [assesment] = await client.createAssessment(request);

        if (assesment.tokenProperties?.valid === false) {
            res.status(500).json({error: assesment.tokenProperties.invalidReason});
        } else {
            if (assesment.event.expectedAction === expectedAction) {
                if (assesment.riskAnalysis.score >= 0.7) {
                    // successful captcha, run any code you want here now and send 200 response
                    res.json({status: 'success'});
                } else {
                    // send 400 response and possibly reason: response.riskAnalysis.reasons
                    res.status(400).json({error: assesment.riskAnalysis.reasons});
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