function get(id){
    if(null != localStorage.getItem(id)){
        return true;
    }
    return false;
}

function set(id, value){
    if(value){
        localStorage.setItem(id, "set");
    } else {
        localStorage.removeItem(id);
    }
}

export default { set, get };
