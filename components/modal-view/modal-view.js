//Component Object
Component({
  properties: {
    title: String,
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        if (newVal) {
          this.setData({
            anim: 'in',
            visible:true
          })
          this.triggerEvent('onshow', {}, {})
        } else {
          this.setData({
            anim: 'out',
          })
          setTimeout(() => {
            this.setData({
              visible:false
            })
            this.triggerEvent('onhide', {}, {})
          }, 200);
        }
      }
    },
    closeable:{
      type:Boolean,
      value:true,
      observer:function(newVal,oldVal,changedPath){
        if(!newVal){
          this.setData({
            close:false
          })
        }
      }
    }
  },
  data: {
    anim: 'in',
    visible:false,
    closeable:true
  },
  methods: {
    close: function () {
      this.setData({
        show: false
      })
    },
    nullEvent: function () { },
  },
  created: function () {

  },
  attached: function () {

  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
});