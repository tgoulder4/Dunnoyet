import { merriweather } from "@/app/fonts";
import { TinyColor } from "@ctrl/tinycolor";
export const changeColour = (colour: string) => {
    return new TinyColor(colour)
}
export const responsiveFont = (maxSizeInRem: number) => {
    return 'clamp(' + (0.75 * maxSizeInRem).toFixed(2) + "rem,3vw," + maxSizeInRem + 'rem)'

}
export const isProd = true;
export const colours = {
    background: "#f3f2f7",
    white: "#ebebeb",
    complementary: "#3d3d3d",
    complementary_lighter: "#969696",
    complementary_lightest: "#e3e3e3",
    card: "#ffffff",
    cardForeground: "#3d3d3d",
    popover: "#ffffff",
    popoverForeground: "#0a0a0b",
    primary: "#438BCE",
    primaryObnoxious: "#3F4CC3",
    primaryForeground: "#fdf4f7",
    secondary: "#C7D6E6",
    secondaryForeground: "#1a1a29",
    blue: '#9BC9E2',
    accent: "#E0F4FF",
    destructive: "#f75a72",
    error: "#f75a72",
    success: "#4caf50",
    destructiveForeground: "#fcfcfc",
    border: "#e8e8ed",
    inputBorder: "#757575",
    link: "#19445C",
    textLegend: "#616161",
    black: "#131313",
    interrogativeMessage: '#0A1B1E',
    systemEventMessage: '#3F2962',
    lessonNodes: {
        //5=wellKnown, 4=currentlyTeaching, 3=failedTest,2=target,1=makeNewKnowledgeAnchorPoint aka force correct their knowledge to a position
        confidence2: "#438BCE",
        confidence1: "#8F8F8F",
        complete: '#4D1B8C',
        background: 'rgba(0, 0, 0, 0.06)',
    },
    light: {
        textColour: "#131313",
        backgroundLight: "#f4f4f4"
    },
    dark: {
        text: "#f4f4f4",
        backgroundDark: "#131313"
    }
}
export const sizing = {
    globalFontSize: '1.2rem',
    largestFontSize: 2.625,
    largerFontSize: 2.25,
    variableWholePagePadding: 'clamp(24px,20vw,800px)',
}
export const navHeight = '4.375rem' // 4.375rem
export const uiBorder = (opacity = 0.2) => `1px solid rgba(0, 0, 0, ${opacity})`;
export const spacing = {
    gaps: {
        groupedElement: 14,
        separateElement: 28,
        largest: 56,
    },
    padding: {
        input: 20,
        normalX: 20,
        normalY: 28,
        smallerX: 10,
        smallerY: 12,
        largest: 56
    },
}
export const lessonPaddingBottom = 2 * spacing.gaps.separateElement;
export const maxLandingWidth = "1320px";
export const lessonXPadding: string = 'clamp(24px,4vw,400px)';
export const DunnoyetLogo = ({ colour, withText }: { colour: string, withText?: boolean }) => {
    return (
        <div className="flex flex-row items-center" style={{ columnGap: spacing.gaps.groupedElement }}>
            <svg width="61" height="27" viewBox="0 0 61 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_813_1427)">
                    <path d="M39.1941 23.8527L39.194 23.8528L39.2053 23.8582C42.0976 25.2472 45.1159 25.5138 48.1106 24.4475C50.5773 23.5692 52.5025 22.215 53.8872 20.4172C55.2707 18.6209 56.0936 16.4091 56.4005 13.8465C56.4387 13.5276 56.5013 13.3963 56.5589 13.3289C56.6092 13.2701 56.7127 13.1937 57.0067 13.1369C57.3594 13.0687 57.7241 13.0337 58.1141 12.9973C58.6726 12.9451 59.1677 12.7605 59.5223 12.3834C59.8785 12.0047 60.0293 11.4998 60.0349 10.9374C60.0409 10.3347 60.0397 9.73196 60.0385 9.13269C60.0383 9.04362 60.0381 8.95463 60.038 8.86573C60.037 8.32111 59.8916 7.82291 59.5337 7.4613C59.1752 7.09909 58.6785 6.94949 58.1331 6.94675C57.9161 6.94566 57.6979 6.94385 57.4787 6.94203C56.6873 6.93547 55.8835 6.9288 55.0833 6.95554C54.9338 6.96054 54.8602 6.93484 54.8144 6.90896C54.7631 6.87998 54.6963 6.82226 54.6038 6.68483C52.5819 3.68061 49.7948 1.8233 46.132 1.32899C44.2372 1.07328 42.383 1.23146 40.5767 1.8263C37.4306 2.86231 35.2137 4.97322 33.697 7.81584C33.6856 7.83712 33.675 7.85855 33.6653 7.879C31.8304 7.0241 29.9607 7.01876 28.126 7.85829C28.1109 7.83225 28.0959 7.80627 28.0809 7.78036C27.8869 7.44566 27.6989 7.12124 27.5015 6.81105C24.6609 2.34632 19.9093 0.593244 15.113 1.4012C11.6193 1.98971 8.98502 3.88212 7.11094 6.80667C7.05025 6.90136 7.01446 6.92255 7.00296 6.92859C6.99019 6.93529 6.95183 6.9521 6.83927 6.95056C5.73715 6.93552 4.63564 6.93889 3.53635 6.95085C3.07922 6.95582 2.64743 7.09874 2.3188 7.38881C1.98562 7.68289 1.79268 8.09886 1.77214 8.57695L1.7706 8.6128C1.73267 9.49461 1.69223 10.435 1.82365 11.374C1.88446 11.8086 2.06912 12.192 2.37094 12.4802C2.67192 12.7677 3.06319 12.9357 3.49702 12.986C3.7584 13.0163 4.02922 13.0364 4.28725 13.0555C4.40604 13.0643 4.52211 13.0729 4.6333 13.0822C4.92466 13.1066 5.09614 13.188 5.19351 13.2746C5.28343 13.3546 5.35436 13.4777 5.37105 13.6885C5.53062 15.7033 6.13931 17.583 7.2187 19.2974C9.36264 22.7027 12.4757 24.6867 16.519 25.0182C19.4795 25.2609 22.2115 24.4358 24.559 22.6078C27.594 20.2446 29.1985 17.1076 29.2948 13.254C29.3111 12.6011 29.285 11.9456 29.1992 11.2895L28.7034 11.3544L29.1992 11.2895C29.1954 11.2607 29.197 11.244 29.1984 11.2362C29.1996 11.2289 29.2015 11.2237 29.2046 11.2179C29.2115 11.205 29.2356 11.17 29.3125 11.1176C29.6431 10.8919 30.2169 10.745 30.8509 10.7396C31.485 10.7342 32.0608 10.8714 32.3959 11.0939C32.491 11.1571 32.5367 11.1997 32.5591 11.2298C32.5683 11.2422 32.5715 11.2498 32.5729 11.2541C32.5742 11.2579 32.5768 11.267 32.5764 11.2859C32.574 11.3947 32.5739 11.4912 32.5739 11.5808C32.5738 11.7536 32.5737 11.9009 32.5567 12.0615C32.3366 14.147 32.7127 16.1308 33.5771 18.0123C34.7612 20.5895 36.6282 22.5406 39.1941 23.8527ZM4.82645 10.1155L4.91157 10.6082L4.82645 10.1155C4.80859 10.1186 4.80197 10.1166 4.80159 10.1165C4.80046 10.1162 4.79425 10.1146 4.78195 10.1057C4.75251 10.0842 4.70482 10.0318 4.65561 9.93148C4.64028 9.90025 4.63862 9.88435 4.63839 9.88134C4.63821 9.87915 4.63813 9.87794 4.63961 9.8736C4.64441 9.85945 4.66774 9.81274 4.75357 9.73998C4.79336 9.70625 4.81893 9.69938 4.82714 9.69783C4.83429 9.69647 4.84208 9.69625 4.85571 9.70163C4.88215 9.71209 4.95299 9.75695 5.01969 9.8888C5.01237 9.99136 4.98541 10.0348 4.97408 10.0494C4.96222 10.0646 4.92972 10.0977 4.82645 10.1155ZM57.0938 9.78579L57.4786 9.46651L57.0939 9.7858C57.138 9.83894 57.1403 9.87442 57.1389 9.89252C57.1372 9.91346 57.1255 9.9638 57.0564 10.0311L57.4055 10.3891L57.0564 10.0311C57.0185 10.0681 56.9843 10.0915 56.9517 10.1059C56.8776 10.0826 56.8406 10.0558 56.8226 10.0387C56.8018 10.019 56.7756 9.98369 56.761 9.89897C56.7565 9.87235 56.7602 9.85793 56.7672 9.84332C56.7766 9.82361 56.8006 9.78861 56.856 9.74628L56.5525 9.34898L56.856 9.74627C56.899 9.71341 56.9386 9.70682 56.9717 9.71112C57.0061 9.71559 57.0514 9.73464 57.0938 9.78579ZM42.6863 4.90565C46.9061 4.0118 51.0301 6.32917 52.4164 10.379C54.0743 15.5799 50.4942 20.4163 46.1703 21.2656C43.1551 21.8578 40.56 21.1015 38.4297 18.869C36.6654 17.0201 35.9362 14.8123 36.1435 12.2811C36.452 8.51618 39.2269 5.63842 42.6863 4.90565ZM11.1348 7.40894C11.4674 7.03138 11.85 6.70023 12.2676 6.37402C14.0651 5.06791 16.0117 4.57832 18.1683 4.79173C20.5055 5.02301 22.4044 6.03072 23.8523 7.84909C24.908 9.1749 25.5226 10.6745 25.6608 12.3782C25.9069 15.4109 24.7664 17.8248 22.4303 19.7234C20.8523 21.0058 18.9926 21.5732 16.9331 21.4362C15.0702 21.3122 13.539 20.7536 12.3208 19.8256C11.1017 18.8969 10.1679 17.5766 9.53598 15.8855C8.39055 12.8202 8.9088 9.936 11.1348 7.40894Z" fill={colour} stroke={colour} />
                </g>
                <defs>
                    <clipPath id="clip0_813_1427">
                        <rect width="61" height="26" fill="#000" transform="translate(0 0.5)" />
                    </clipPath>
                </defs>
            </svg>

            {withText && <h1 className="hidden xl:block text-black" style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.globalFontSize }}>dunnoyet.</h1>}
        </div>

    )
}