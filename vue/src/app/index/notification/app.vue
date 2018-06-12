<template>
<div class="container">
    <div class='location'>
       famlink works better with notifications. like way, way better
    </div>
    <div class='notified'>get notified when...</div>
    <ul class='notifiedUl'>
       <li><i class='notified-imgOne'></i><div class='info-text'>someone wants to be your friend</div></li>
       <li><i class='notified-imgTwo'></i><div class='info-text'>something interesting is going on around you</div></li>
       <li><i class='notified-imgThree'></i><div class='info-text'>your friend sends you a message</div></li>
    </ul>
    <a href="/index/index.html" class='next'><div class='next-btn notifiedBtn'>Enable location services</div></a>
</div>
</template>

<script>

// css
require("assets/css/min.css");


export default {
    data () {
        return {
        }
    },

    methods:{
    },
    components: {
    },
    events:{
    }
}
</script>
