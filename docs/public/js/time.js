export const accurateTimer = (callback, time = 1000) => {
    let nextAt = Date.now() + time, timeout;
    const wrapper = () => {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - Date.now());
        callback();
    }

    const cancel = () => clearTimeout(timeout);
    timeout = setTimeout(wrapper, nextAt - Date.now());
    return { cancel }
}