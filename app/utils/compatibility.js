function createImageBitmapSupport(){
    if(window.createImageBitmap === undefined) return false;

    const is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const is_iphone = /(iPhone)/i.test(navigator.userAgent);
    const maybe_chrome = /(chrome)/i.test(navigator.userAgent);

    if(is_safari) return false;
    if(is_iphone) return maybe_chrome;

    return true;
}

export default {
    createImageBitmapSupport,    
}
