import React from 'react'
import { Analytics } from '@deriv/analytics'
import { signup_apple_btn, signup_fb_btn, signup_login_redirect } from '../signup.module.scss'
import Login from 'common/login'
import Button from 'features/components/atoms/button'
import Flex from 'features/components/atoms/flex-box'
import Image from 'features/components/atoms/image'
import Typography from 'features/components/atoms/typography'
import AppleLogo from 'images/svg/signup_apple_icon.svg'
import FacebookLogo from 'images/svg/signup_fb_icon.svg'
import GoogleLogo from 'images/svg/google_logo.svg'
import { Localize } from 'components/localization'
import { isBrowser } from 'common/utility'

const FormSocialButtons = () => {
    const analyticsData: Parameters<typeof Analytics.trackEvent>[1] = {
        action: 'started',
        form_source: isBrowser() && window.location.hostname,
        form_name: 'default_diel_deriv',
    }

    return (
        <>
            <Button.Secondary
                outlined
                id="dm-signup-google"
                onClick={() => {
                    Analytics?.trackEvent('ce_virtual_signup_form', {
                        signup_provider: 'google',
                        ...analyticsData,
                    })
                    Login.initOneAll('google')
                }}
            >
                <Flex.Box justify="center" align="end" gap={'2x'}>
                    <Image src={GoogleLogo} />
                    <Typography.Paragraph size="small" weight="bold" font_family="UBUNTU">
                        <Localize translate_text={'_t_Google_t_'} />
                    </Typography.Paragraph>
                </Flex.Box>
            </Button.Secondary>
            <Button.Base
                className={signup_fb_btn}
                id="dm-signup-facebook"
                onClick={() => {
                    Analytics?.trackEvent('ce_virtual_signup_form', {
                        signup_provider: 'google',
                        ...analyticsData,
                    })
                    Login.initOneAll('facebook')
                }}
            >
                <Flex.Box justify="center" align="end" gap={'2x'}>
                    <Image src={FacebookLogo} />
                    <Typography.Paragraph
                        size="small"
                        weight="bold"
                        font_family="UBUNTU"
                        textcolor="white"
                    >
                        <Localize translate_text={'_t_Facebook_t_'} />
                    </Typography.Paragraph>
                </Flex.Box>
            </Button.Base>
            <Button.Base
                className={signup_apple_btn}
                textcolor="white"
                id="dm-signup-apple"
                onClick={() => {
                    Analytics?.trackEvent('ce_virtual_signup_form', {
                        signup_provider: 'apple',
                        ...analyticsData,
                    })
                    Login.initOneAll('apple')
                }}
            >
                <Flex.Box justify="center" align="end" gap={'2x'}>
                    <Image src={AppleLogo} />
                    <Typography.Paragraph
                        size="small"
                        weight="bold"
                        font_family="UBUNTU"
                        textcolor="white"
                    >
                        <Localize translate_text={'_t_Apple_t_'} />
                    </Typography.Paragraph>
                </Flex.Box>
            </Button.Base>
            <Typography.Paragraph align="center">
                <Localize
                    translate_text="_t_Already have an account? <0>Log in</0>_t_"
                    components={[
                        <Typography.Paragraph
                            as="span"
                            textcolor="brand"
                            key={0}
                            className={signup_login_redirect}
                            onClick={(event) => {
                                event.preventDefault()
                                Analytics?.trackEvent('ce_virtual_signup_form', {
                                    signup_provider: 'email',
                                    ...analyticsData,
                                })
                                Login.redirectToLogin()
                            }}
                        />,
                    ]}
                />
            </Typography.Paragraph>
        </>
    )
}

export default FormSocialButtons
