import React from 'react';

export default ({ root, target, onIntersect, threshold = 1.0, rootMargin = "0px" }:
    { root: HTMLDivElement, target: HTMLDivElement, onIntersect: IntersectionObserverCallback, threshold?: number, rootMargin?: string }) => {
    React.useEffect(
        () => {
            if (!root) {
                return;
            }

            const observer = new IntersectionObserver(onIntersect, {
                root,
                rootMargin,
                threshold,
            });

            if (!target) {
                return;
            }

            observer.observe(target);

            return () => {
                observer.unobserve(target);
            };
        }, [ target, root, rootMargin, onIntersect, threshold ]
    );
};