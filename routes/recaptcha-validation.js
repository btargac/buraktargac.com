let routeRecaptcha = async (req, res) => {
    let captcha = req.app.get('captcha');

    const expectedAction = req.body.action;
    const request = {
        assessment: {
            event: {
                token: req.body.token,
                siteKey: captcha.siteKey,
                userAgent: req.headers['user-agent'],
                userIpAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                expectedAction: expectedAction
            }
        },
        parent: captcha.client.projectPath(captcha.projectId)
    };

    captcha.client.createAssessment(request, (error, response) => {
        if (error) {
            // send 500 response here and log the error
            console.error(error);
            res.status(500).json({error});
            return;
        }

        if (response.tokenProperties.valid === false) {
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
    });
};

module.exports = routeRecaptcha;