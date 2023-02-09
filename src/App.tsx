import React, { useLayoutEffect, useRef } from 'react'
import './styles.scss'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

const App = () => {
    const app = useRef() as React.MutableRefObject<HTMLInputElement> // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572#issuecomment-493942129
    const svg = useRef() as React.MutableRefObject<SVGSVGElement>

    gsap.registerPlugin(MotionPathPlugin)

    useLayoutEffect(() => {
        const circlePath = MotionPathPlugin.convertToPath('#holder', false)[0]
        circlePath.id = 'circlePath'

        svg.current.appendChild(circlePath)

        const items = gsap.utils.toArray('.item'),
            numItems = items.length,
            itemStep = 1 / numItems,
            wrapProgress = gsap.utils.wrap(0, 1),
            snap = gsap.utils.snap(itemStep),
            wrapTracker = gsap.utils.wrap(0, numItems),
            tracker = { item: 0 }

        const ctx = gsap.context(() => {
            gsap.set(items, {
                // @ts-ignore
                motionPath: {
                    path: circlePath,
                    align: circlePath,
                    alignOrigin: [0.5, 0.5],
                    start: -0.17,
                    end: (i: any) => i / items.length - 0.17,
                },
                scale: 0.9,
            })

            const tl = gsap.timeline({ paused: true, reversed: true })

            tl.to('.wrapper', {
                rotation: 360,
                transformOrigin: 'center',
                duration: 1,
                ease: 'none',
            })

            tl.to(
                items,
                {
                    rotation: '-=360',
                    transformOrigin: 'center',
                    duration: 1,
                    ease: 'none',
                },
                0
            )

            tl.to(
                tracker,
                {
                    item: numItems,
                    duration: 1,
                    ease: 'none',
                    modifiers: {
                        item(value) {
                            return wrapTracker(numItems - Math.round(value))
                        },
                    },
                },
                0
            )

            console.log(items)

            items.forEach((el: any, i) => {
                el.addEventListener('click', function () {
                    const current = tracker.item,
                        activeItem = i

                    if (i === current) {
                        return
                    }

                    //set active item to the item that was clicked and remove active class from all items

                    document!.querySelector!('.item.active')!.classList.remove('active')
                    // @ts-ignore
                    items[activeItem].classList.add('active')

                    const diff = current - i

                    if (Math.abs(diff) < numItems / 2) {
                        moveWheel(diff * itemStep)
                    } else {
                        const amt = numItems - Math.abs(diff)

                        if (current > i) {
                            moveWheel(amt * -itemStep)
                        } else {
                            moveWheel(amt * itemStep)
                        }
                    }
                })
            })

            function moveWheel(amount: any) {
                let progress = tl.progress()
                tl.progress(wrapProgress(snap(tl.progress() + amount)))
                let next = tracker.item
                tl.progress(progress)

                // @ts-ignore
                document.querySelector('.item.active').classList.remove('active')
                // @ts-ignore
                items[next].classList.add('active')

                gsap.to(tl, {
                    progress: snap(tl.progress() + amount),
                    modifiers: {
                        progress: wrapProgress,
                    },
                })
            }
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
                <div className="item 6 ">6</div>
                <svg viewBox="0 0 300 300" ref={svg}>
                    <circle id="holder" className="st0" cx="151" cy="151" r="150" />
                </svg>
            </div>
        </div>
    )
}

export default App
