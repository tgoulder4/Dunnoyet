import React from 'react'

interface lessonSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    // You can add other custom props here if needed
}
const LessonSection: React.FC<lessonSectionProps> = ({ children, className, ...props }) => {
    return (
        <section {...props} className={`${className} p-8 transition-colors`}>{children}</section>
    )
}

export default LessonSection