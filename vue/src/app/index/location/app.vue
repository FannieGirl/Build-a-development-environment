<template>
<div class="container">
    <div class='location'>
       famlink only works if can "Always" or "While Using the App" access your location
    </div>
    <ul class='info'>
       <li><i class='info-imgOne'></i><div class='info-text'>start by tapping the "Enable location services" button the bottom of this screen</div></li>
       <li><i class='info-imgTwo'></i><div class='info-text'>tap"Location</div></li>
       <li><i class='info-imgThree'></i><div class='info-text'>choose"Always" or "While Using the App</div></li>
    </ul>
    <a href="/index/notification.html" class='next'><div class='next-btn locationBtn'>Enable location services</div></a>
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
