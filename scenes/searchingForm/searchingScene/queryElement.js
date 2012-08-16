/**
 * 查询场景使用的查询条件元素
 * 抽象基类
 * 继承自Cell
 */
(function(cellula){
    var UtilTools = cellula._util;
    cellula.QueryElement = new cellula.Class('QueryElement',{
        //细胞核存放数据
        nucleus:null,
        
        getProp : function(name){
            return this.data[name];
        },
        validate : function(data, el){
            
        },
        init : function (cfg) {
            if (UtilTools.isObject(cfg)) {
                for (var n in this) {
                    UtilTools.isObject(this[n]) && UtilTools.isObject(cfg[n]) ? this[n] = UtilTools.deepMix({},this[n],cfg[n]): this[n] = cfg[n] ? cfg[n] : this[n];
                }
            }
            this.render();
            this.nucleus.on('error',this.error,this)
        }

    }).inherits(cellula.Cell);

    cellula.QueryElement.Input = new cellula.Class('QueryElement.Input',{
        formExplain:'请填写',
        render:function(){
            this._super();
            var inputV = this.nucleus.get('value');
            $(this.rootNode).find('input').get(0).value = inputV;
        },
        registerEvents:function(){
            var that = this;
            $(this.rootNode).find('input').blur(function(e){
                that.nucleus.set('value',this.value);
            });
            $(this.rootNode).find('input').focus(function(e){
               that.clearErrorState();
            });
        },
        error:function(errMsg){
            $(this.rootNode).addClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML = errMsg;
        },
        clearErrorState:function(){
            $(this.rootNode).removeClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML =this.formExplain;
        }


    }).inherits(cellula.QueryElement);




})(Cellula);



var ElementFactory = function (typeClass, elements) {

}