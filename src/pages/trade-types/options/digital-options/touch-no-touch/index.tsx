import React from 'react'
import TouchNoTouchDigitalOptionsPage from 'features/pages/options/digital/touch-no-touch'
import { faq_schema } from 'features/pages/options/digital/touch-no-touch/_faq-schema'
import { WithIntl } from 'components/localization'
import ProtectedRoute from 'features/components/molecules/protected-route'
import useRegion from 'components/hooks/use-region'
import { SEO } from 'components/containers'
import { TGatsbyHead } from 'features/types'

const TouchNoTouchDigitalOptions = () => {
    const { is_row, is_region_loading } = useRegion()
    return (
        <ProtectedRoute
            is_page_visible={is_row}
            component={<TouchNoTouchDigitalOptionsPage />}
            is_loading={is_region_loading}
        />
    )
}

export default WithIntl()(TouchNoTouchDigitalOptions)

export const Head = ({ pageContext }: TGatsbyHead) => (
    <SEO
        title="_t_Touch/No touch | Digital options contract | Deriv_t_"
        description="_t_Open a digital options contract with a Touch/No touch trade type on Deriv’s trading platforms and earn payouts with accurate market predictions._t_"
        pageContext={pageContext}
    >
        <script type="application/ld+json">{JSON.stringify(faq_schema)}</script>
    </SEO>
)
