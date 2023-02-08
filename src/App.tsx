import React, { useLayoutEffect, useRef } from 'react'
import './styles.scss'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

const App = () => {
    const app = useRef() as React.MutableRefObject<HTMLInputElement> // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572#issuecomment-493942129

    gsap.registerPlugin(MotionPathPlugin)

    const circlePath = MotionPathPlugin.convertToPath('#holder', false)[0]
    circlePath.id = 'circlePath'

    const svg = useRef() as React.MutableRefObject<SVGSVGElement>

    if (svg.current) {
        svg.current!.appendChild(circlePath)
    }

    const items = gsap.utils.toArray('.item'),
        numItems = items.length,
        itemStep = 1 / numItems,
        wrapProgress = gsap.utils.wrap(0, 1),
        snap = gsap.utils.snap(itemStep),
        wrapTracker = gsap.utils.wrap(0, numItems),
        tracker = { item: 0 }

    useLayoutEffect(() => {
        // document.querySelector('svg').prepend(circlePath)

        const ctx = gsap.context(() => {
            // use scoped selectors
            gsap.to('.box', { rotation: 800 })
            // or refs
            gsap.to('.circle', { rotation: 800 })
        }, app)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={app} className="App">
            <div className="wrapper">
                <div className="item 1 active">1</div>
                <div className="item 2">2</div>
                <div className="item 3">3</div>
                <div className="item 4">4</div>
                <div className="item 5">5</div>
                <div className="item 6">6</div>
                <svg viewBox="0 0 300 300" ref={svg}>
                    <circle id="holder" className="st0" cx="151" cy="151" r="150" />
                </svg>
            </div>
        </div>
    )
}

export default App
