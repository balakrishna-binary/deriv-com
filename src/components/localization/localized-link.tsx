import React, { CSSProperties, Ref, useContext } from 'react'
import styled, { css } from 'styled-components'
import { Link as GatsbyLink } from 'gatsby'
import { LocationContext } from '../layout/location-context'
import language_config from '../../../i18n-config'
import { LocaleContext } from './locale-context'
import device from 'themes/device'
import { localized_link_url } from 'common/constants'
import {
    getLocalizedUrl,
    getDerivAppLocalizedURL,
    getSmartTraderLocalizedURL,
    getThaiExcludedLocale,
    replaceLocale,
} from 'common/utility'
import { usePageLoaded } from 'components/hooks/use-page-loaded'
import useRegion from 'components/hooks/use-region'

type InternalLinkProps = {
    aria_label?: string
    children?: string | JSX.Element | JSX.Element[]
    has_no_end_slash?: boolean
    locale?: string
    mounted?: boolean
    to?: string
    ref?: Ref<GatsbyLink<string>>
}

type ExternalLinkProps = InternalLinkProps & {
    is_mail_link?: boolean
    onClick?: (arg: MouseEvent) => void
    rel?: string
    style?: CSSProperties
    target?: string
    type?: string
}

type LocalizedLinkProps = ExternalLinkProps & {
    external?: boolean
    weight?: string
    partiallyActive?: boolean
}

type SharedLinkStyleProps = {
    active: boolean
    disabled?: boolean
    activeClassName?: string
}

export const SharedLinkStyle = css<SharedLinkStyleProps>`
    color: var(--color-white);
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: text-shadow 0.25s;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        transition: width 0.25s;
        height: 0.2rem;
        width: 0;
        background-color: var(--color-red);
        bottom: 0;
    }
    &:hover {
        text-shadow: 0 0 0.8px var(--color-white), 0 0 0.8px var(--color-white);

        &::before {
            width: 1.6rem;
        }
    }
    &.active {
        text-shadow: 0 0 0.8px var(--color-white), 0 0 0.8px var(--color-white);
    }

    ${({ active }) =>
        active &&
        css`
            text-shadow: 0 0 0.8px var(--color-white), 0 0 0.8px var(--color-white);

            &::before {
                width: 1.6rem;
            }
        `}
`
export const SharedLinkStyleMarket = css<SharedLinkStyleProps>`
    color: var(--color-white);
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: text-shadow 0.25s;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        transition: width 0.25s;
        height: 0.2rem;
        width: 0;
        background-color: var(--color-red);
        bottom: 0;
    }
    &:hover {
        color: gray;
    }
    &.active {
        color: gray;
    }

    ${({ active }) =>
        active &&
        css`
            color: gray;
        `}
    @media ${device.laptopL} {
        font-size: 14px;
    }
`
const ShareDisabledStyle = css<{ disabled?: boolean }>`
    ${({ disabled }) =>
        disabled &&
        `
        pointer-events: none;
        opacity: 0.32;`}
`

const StyledGatsbyLink = styled(GatsbyLink)`
    ${ShareDisabledStyle}
`

export const LocalizedLink = React.forwardRef(
    ({ external, ...props }: LocalizedLinkProps, ref: Ref<GatsbyLink<string>>) => {
        const { locale } = useContext(LocaleContext)
        const [is_mounted] = usePageLoaded()

        if (external) {
            return (
                <ExternalLink
                    mounted={is_mounted}
                    // HINT: In our project we don't have Arabic translations yet, so we have to use the default locale (en) instead
                    locale={locale === 'ar' ? 'en' : locale}
                    ref={ref}
                    {...props}
                />
            )
        }

        return <InternalLink mounted={is_mounted} locale={locale} ref={ref} {...props} />
    },
)

LocalizedLink.displayName = 'LocalizedLink'

const non_localized_links = ['/careers', '/academy']

const InternalLink = ({
    aria_label,
    children,
    mounted,
    has_no_end_slash,
    locale,
    to,
    ...props
}: InternalLinkProps) => {
    // If it's the default language or non localized link, don't do anything
    // If it's another language, add the "path"
    // However, if the homepage/index page is linked don't add the "to"
    // Because otherwise this would add a trailing slash
    const { is_default, path } = language_config[locale]
    const is_non_localized = non_localized_links.includes(to?.replace(/\/$/, ''))
    const is_index = to === `/`
    const localized_url = getLocalizedUrl(path, is_index, to)
    const path_to = is_default || is_non_localized ? to : localized_url
    let internal_to = path_to

    // remove trailing character only if it is a forward slash
    internal_to = has_no_end_slash ? internal_to.replace(/\/$/, '') : internal_to

    return (
        <StyledGatsbyLink aria-label={aria_label} to={internal_to} {...props}>
            {children}
        </StyledGatsbyLink>
    )
}

const affiliate_links = ['affiliate_sign_in', 'affiliate_sign_up']
const deriv_app_links = ['dbot', 'deriv_app', 'mt5', 'derivx']
const deriv_other_products = ['binary', 'smart_trader', 'binary_bot']
const deriv_social_platforms = ['blog', 'community', 'api', 'zoho', 'derivlife', 'academy']
// add item to this array if you need to make an internal link open on a new tab without modal window
// !only for  paths without localisation: add item to this array if you need to make an internal link open on a new tab without modal window
const only_en_new_tab_no_modal = ['tnc/security-and-privacy.pdf']
const new_tab_no_modal = ['terms_and_conditions/#clients']

const getURLFormat = (type, locale, to, affiliate_lang) => {
    if (deriv_app_links.includes(type)) {
        return getDerivAppLocalizedURL(localized_link_url[type], locale, to)
    } else if (affiliate_links.includes(type)) {
        return `${localized_link_url[type]}?lang=${affiliate_lang}`
    } else if (deriv_other_products.includes(type)) {
        if (type === 'binary_bot') return `${localized_link_url[type]}/${to ? to : ''}?l=${locale}`
        else if (type === 'smart_trader')
            return getSmartTraderLocalizedURL(localized_link_url[type], locale)

        return `${localized_link_url[type]}/${getThaiExcludedLocale(locale)}/${to}.html`
    } else if (deriv_social_platforms.includes(type)) {
        return `${localized_link_url[type]}${to}`
    } else if (new_tab_no_modal.includes(type)) {
        return `${localized_link_url.domain_full_url}${locale === 'en' ? '' : '/' + locale}/${
            type.replace(/_/g, '-') + '/'
        }`
    } else if (only_en_new_tab_no_modal.includes(type)) {
        return `${localized_link_url.domain_full_url}/${type.replace(/_/g, '-')}`
    } else {
        return to
    }
}

const ExternalLink = ({
    aria_label,
    children,
    mounted,
    is_mail_link,
    locale,
    onClick,
    ref,
    rel,
    style,
    target,
    to,
    type,
    ...props
}: ExternalLinkProps) => {
    const { is_eu } = useRegion()
    const { setModalPayload, toggleModal } = useContext(LocationContext)
    const { affiliate_lang } = language_config[locale]
    const url = replaceLocale(getURLFormat(type, locale, to, affiliate_lang))
    const show_modal =
        is_eu &&
        !is_mail_link &&
        !affiliate_links.includes(type) &&
        !deriv_app_links.includes(type) &&
        !deriv_social_platforms.includes(type) &&
        !new_tab_no_modal.includes(type) &&
        !only_en_new_tab_no_modal.includes(type)

    const default_style = { cursor: 'pointer' }
    let final_target = target
    if (new_tab_no_modal.includes(type) || only_en_new_tab_no_modal.includes(type)) {
        final_target = '__blank'
    }

    const handleClick = (e) => {
        if (show_modal) {
            e.preventDefault()
            setModalPayload({
                to: url,
                target,
                rel,
                ref,
                aria_label: aria_label,
            })
            toggleModal(e)
        }
        if (typeof onClick === 'function') {
            onClick(e)
        }
    }

    return (
        <a
            style={style ? style : default_style}
            aria-label={aria_label}
            href={!show_modal ? url : ''}
            onClick={show_modal ? handleClick : null}
            target={final_target}
            rel={rel}
            {...props}
        >
            {children}
        </a>
    )
}
