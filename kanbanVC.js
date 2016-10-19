$(document).ready(function() {
    
    var kanbanVC = {};

    kanbanVC.$input_header  = $(".content-form__input_header");
    kanbanVC.$input_tag     = $(".content-form__input_tag");
    kanbanVC.$input_date1   = $(".content-form__input_date1");
    kanbanVC.$input_date2   = $(".content-form__input_date2");
    kanbanVC.$input_handle  = $("#content-form__handle");
    kanbanVC.$input_slider  = $(".content-form__slider");
    kanbanVC.$input_annot   = $(".content-form__input_annot");
    kanbanVC.$btn_delete    = $(".window__btn_delete");
    kanbanVC.$btn_save      = $(".window__btn_save");

    kanbanVC.initView = function() {
       
        kanbanVC.createInitialTasks("kanbanTable1",kanbanTable_tasks.kanbanTable1.length);
        kanbanVC.createInitialTasks("kanbanTable2",kanbanTable_tasks.kanbanTable2.length);
        kanbanVC.createInitialTasks("kanbanTable3",kanbanTable_tasks.kanbanTable3.length);
        kanbanVC.createInitialTasks("kanbanTable4",kanbanTable_tasks.kanbanTable4.length);
    };

    $(".main-overlay__preloader").fadeOut();  
    $(".main-overlay").delay(350).fadeOut("slow");  
    $("body").delay(350).css({"overflow":"visible"});
    $( document ).tooltip();
    $( function() {
        $(".content-form__input_date1, .content-form__input_date2").datepicker({
            showAnim: "clip",
            minDate: 0,
            dateFormat: "dd/mm/yy"
        });
    });

    $( function() {
        $(".kanbanTable1>ul, .kanbanTable2>ul, .kanbanTable3>ul, .kanbanTable4>ul" ).sortable({
            connectWith: ".kanbanTable-list",
            start: function(event, ui) { 
                kanbanVC.startingTable = ui.item.parent().parent().attr("class");
                kanbanVC.startingIndex = ui.item.index();
            },
            update: function(event, ui) { 
                if (this === ui.item.parent()[0]) { //prevent from trigger twice
                   
                    var updatedTable = ui.item.parent().parent().attr("class");
                    var movedTask = kanbanTable_tasks[kanbanVC.startingTable][kanbanVC.startingIndex];
                    
                     
                    kanbanTable_tasks[kanbanVC.startingTable].splice(kanbanVC.startingIndex, 1);
                    kanbanTable_tasks[updatedTable].splice(ui.item.index(), 0, updatedTable); 

                    console.log( movedTask );
                    console.log( "update 0: "+ kanbanTable_tasks[updatedTable][ui.item.index()]);
                }
            }
        }).disableSelection();
    });

    $( function() {
        kanbanVC.$input_slider.slider({
            create: function() {
                kanbanVC.$input_handle.text( $( this ).slider( "value" ) );
            },
            slide: function( event, ui ) {
                kanbanVC.$input_handle.text( ui.value );
            }
        });
   });

    kanbanVC.createInitialTasks = function(tableName, tableLength) {

        for( var i = 0; i < tableLength; i++ ){
           var taskHeader = _.get(kanbanTable_tasks, [tableName, i, "taskHeader"]);
           var taskColor = _.get(kanbanTable_tasks, [tableName, i, "taskColor"]);
           var taskTag = _.get(kanbanTable_tasks, [tableName, i, "taskTag"]);
           var taskDate1 = _.get(kanbanTable_tasks, [tableName, i, "taskDate1"]);
           var taskDate2 = _.get(kanbanTable_tasks, [tableName, i, "taskDate2"]);
           var taskProgress = _.get(kanbanTable_tasks, [tableName, i, "taskProgress"]);
           
           var taskAnno = _.get(kanbanTable_tasks, [tableName, i, "taskAnno"]);
           var $kanbanTableList = $("."+tableName).children(".kanbanTable-list");
           kanbanVC.createTask( $kanbanTableList ,taskHeader, taskColor, taskTag, taskDate1, taskDate2, taskProgress, taskAnno, "newTask"); 
        }
    }

    kanbanVC.createTask = function($kanbanTableList, taskHeader, taskColor, taskTag, taskDate1, taskDate2, taskProgress, taskAnno, itemIndex ){
        
        taskHeader = '<div class="list-item__header">'+taskHeader+'</div>';
        taskTag = '<div class="list-item__tag">'+taskTag+'</div>';

        if(taskDate1 !== ""){
            taskDate1 = '<div class="ui-icon ui-icon-clock icon_time" title="Start date: '+taskDate1+'"></div>';    
        }
        if(taskDate2 !== ""){
           taskDate2 = '<div class="list-item__date">Date due: '+taskDate2+'</div>';    
        }
        if(taskProgress != 0){
           taskProgress = '<div class="list-item__progress"><progress class="progress-bar" value="'+taskProgress+'" max="100"></progress><p class="progress-value">'+taskProgress+'%</p></div>';   
        }else{
           taskProgress ="";
        }
        if(taskAnno !== ""){
            taskAnno = '<div class="ui-icon ui-icon-comment icon_comment" title="'+taskAnno+'"></div>';    
        }
        var liContent = taskHeader+taskDate1+taskAnno+taskTag+taskDate2+taskProgress+'<div class="list-item__color"></div>';
        
        if(itemIndex === "newTask"){ //new task
            $kanbanTableList.append('<li class="list-item">'+liContent+'</li>'); 
            $kanbanTableList.children().last().children(".list-item__color").css( {"background-color" : taskColor });
        }else{ //update task
           $kanbanTableList.children().eq(itemIndex).html(liContent);
           $kanbanTableList.children().eq(itemIndex).children(".list-item__color").css( {"background-color" : taskColor });
        }
        
    };

    $(".kanbanTable__btn_add").click(function(){

        kanbanVC.$current_list = $(this).siblings(".kanbanTable-list");
        kanbanVC.newOrUpdate = "newTask";

        $(".main-overlay").css({"background-color":"#888"});  
        $('.main-overlay').css({'opacity':'0.5'}).fadeIn('slow');
        $('.main-window').fadeIn();
      
    });

    $(document).on( "dblclick", ".list-item", function(){

        kanbanVC.$current_list = $(this).parent();
        var tableName = kanbanVC.$current_list.parent().attr("class");
        var itemIndex = $(this).index();
        kanbanVC.newOrUpdate = itemIndex;

        kanbanVC.$input_header.val(_.get(kanbanTable_tasks, [tableName, itemIndex, "taskHeader"]) );
        var color =_.get(kanbanTable_tasks, [tableName, itemIndex, "taskColor"]);
        $(".form-radio_group [value='"+color+"']").prop( "checked", true );
        kanbanVC.$input_tag.val(_.get(kanbanTable_tasks, [tableName, itemIndex, "taskTag"]) );
        kanbanVC.$input_date1.val(_.get(kanbanTable_tasks, [tableName, itemIndex, "taskDate1"]) );
        kanbanVC.$input_date2.val(_.get(kanbanTable_tasks, [tableName, itemIndex, "taskDate1"]) );
        kanbanVC.$input_annot.val(_.get(kanbanTable_tasks, [tableName, itemIndex, "taskAnno"]) );
        kanbanVC.$input_slider.slider("value", _.get(kanbanTable_tasks, [tableName, itemIndex, "taskProgress"]) );
        kanbanVC.$input_handle.text(_.get(kanbanTable_tasks, [tableName, itemIndex, "taskProgress"]));  

        $(".main-overlay").css({"background-color":"#888"});  
        $('.main-overlay').css({'opacity':'0.5'}).fadeIn('slow');
        $('.main-window').fadeIn();
        kanbanVC.$btn_delete.show();
    });

    kanbanVC.newTaskObject = function( taskHeader, taskColor, taskTag, taskDate1, taskDate2, taskProgress, taskAnno){
        
        this.taskHeader = taskHeader;
        this.taskColor = taskColor;
        this.taskTag = taskTag;
        this.taskDate1 = taskDate1;
        this.taskDate2 = taskDate2;
        this.taskProgress = taskProgress;
        this.taskAnno = taskAnno;
    };

    kanbanVC.resetWindowImputs = function(){
        $('.main-overlay').fadeOut();
        $('.main-window').fadeOut("fast");  
        kanbanVC.$btn_delete.hide();

        kanbanVC.$input_header.val("");
        $("#radio1").prop( "checked", true );
        kanbanVC.$input_tag.val("");
        kanbanVC.$input_date1.val("");
        kanbanVC.$input_date2.val("");
        kanbanVC.$input_annot.val("");
        kanbanVC.$input_slider.slider('value',0);
        kanbanVC.$input_handle.text(0);  
    };
    kanbanVC.taskManagement = function(newOrUpdate){
        
        var tableName = kanbanVC.$current_list.parent().attr('class');
       

        var taskObj = new kanbanVC.newTaskObject( 
            kanbanVC.$input_header.val(), 
            $(".form-radio_group input[type='radio']:checked").val(),
            kanbanVC.$input_tag.val(),
            kanbanVC.$input_date1.val(), 
            kanbanVC.$input_date2.val(), 
            kanbanVC.$input_slider.slider('value'),
            kanbanVC.$input_annot.val()
        ); 
        

        kanbanVC.createTask( 
            kanbanVC.$current_list,
            kanbanVC.$input_header.val(), 
            $(".form-radio_group input[type='radio']:checked").val(),
            kanbanVC.$input_tag.val(),
            kanbanVC.$input_date1.val(), 
            kanbanVC.$input_date2.val(), 
            kanbanVC.$input_slider.slider('value'),
            kanbanVC.$input_annot.val(),
            newOrUpdate
        ); 

        if(newOrUpdate === "newTask"){
            kanbanTable_tasks[tableName].push(taskObj);
        } else{
            _.set(kanbanTable_tasks, [tableName, newOrUpdate], taskObj );
        }
    }
    kanbanVC.$btn_save.click(function(){
        kanbanVC.taskManagement(kanbanVC.newOrUpdate);
        kanbanVC.resetWindowImputs();
    });

    $(".window__btn_cancel").click(function(){
        kanbanVC.resetWindowImputs();
    });

    kanbanVC.initView();
});