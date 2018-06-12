class _MenuItemFactory {
    constructor() {
    }

    jbItem(post_id) {
        return {action:"JB", context:{post_id:post_id+""}}
    }

    delPostItem(post_id, pos) {
        return {action:"DEL_POST", context:{post_id:post_id+"", position:pos}}
    }

    followItem(uid) {
        return {action:"FOLLOW_USER", context:{uid:uid+""}}
    }

    fixTop(post_id, group_id) {
        return {action:"FIX_TOP", context:{post_id:post_id, group_id:group_id}}
    }
    unFixTop(post_id) {
        return {action:"UNFIX_TOP", context:{post_id:post_id}}
    }
    createGuild() {
        return {action:"CREATE_GUILD", context:{}}
    }
    joinGuild() {
        return {action:"JOIN_GUILD", context:{}}
    }
}

const MenuItemFactory = new _MenuItemFactory();
export default MenuItemFactory
