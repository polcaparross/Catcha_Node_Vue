<script>
export default{
    props:['src', 'modelValue'],
    emits:['update:modelValue'],  
    data(){
        return{
        border: 'none'

        }
    },
    watch:{
        border(newVal){
            if(newVal == 'border: 4px red solid'){
                this.$emit('update:modelValue', true)
            } else {
                this.$emit('update:modelValue', false)
            }
        }

    },
    computed:{
        handleClick(){
            if(this.border == 'none'){
            
                this.border = `border: 4px red solid`
            }else{
                this.border = 'none'
            }
            
        }
    }
}
</script>

<template>
    <img :src="src" :style="border" @click="handleClick" >
</template>

<style>
</style>