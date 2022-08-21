export default function debugging(key, testvalue){
/// #if DEV
    if(key === undefined) return true;
    
    if(testvalue === undefined){
        return localStorage.getItem(key);
    }

    return testvalue == localStorage.getItem(key);

/// #endif
    return null;
}
