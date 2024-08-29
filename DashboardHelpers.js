/*
required JS library: 
grid stack
chartjs
*/
/* */
let colorBox = [
    [
        "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF",
        "#4B0082", "#8B00FF", "#FFC0CB", "#800000", "#FFD700",
        "#00FA9A", "#00CED1", "#1E90FF", "#9370DB", "#FF1493",
        "#DC143C", "#FF8C00", "#32CD32", "#4169E1", "#6A5ACD"],
    [
        "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99",
        "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a",
        "#ffff99", "#b15928", "#ffddc1", "#d4a6a6", "#a1d3a1",
        "#a3c6ff", "#ffa1b1", "#b2a7df", "#d9f6a6", "#ffb28e"],
    [
        "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3",
        "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd",
        "#ccebc5", "#ffed6f", "#a6a6a6", "#ffdbb1", "#bda7c7",
        "#d9b08b", "#d1b1ff", "#f1ccde", "#c9f1d6", "#b2d6a1"],
    [
        "#f8b620", "#f64971", "#33a65c", "#1ba3c6", "#a26dc2",
        "#f89217", "#fc719e", "#57a337", "#2cb5c0", "#7873c0",
        "#f06719", "#eb73b3", "#a2b627", "#30bcad", "#4f7cba",
        "#e03426", "#ce69be", "#d5bb21", "#21B087", "#356b94"],
    [
        "#4E79A7", "#A0CBE8", "#F28E2B", "#FFBE7D", "#59A14F",
        "#8CD17D", "#B6992D", "#F1CE63", "#499894", "#86BCB6",
        "#E15759", "#FF9D9A", "#79706E", "#BAB0AC", "#D37295",
        "#FABFD2", "#B07AA1", "#D4A6C8", "#9D7660", "#D7B5A6"],
    [
        "#d62728", "#ff9896", "#ff7f0e", "#ffbb78", "#2ca02c",
        "#98df8a", "#1f77b4", "#aec7e8", "#9467bd", "#c5b0d5",
        "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
        "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
    [
        "#9999ff", "#993366", "#ffffcc", "#ccffff", "#660066",
        "#ff8080", "#0066cc", "#ccccff", "#000080", "#ff00ff", 
        "#ffff00", "#0000ff", "#800080", "#800000", "#008080", 
        "#0000ff", "#d8bfd8", "#dda0dd", "#b0c4de", "#add8e6"],
    [
        "#4f6980", "#849db1", "#a2ceaa", "#638b66", "#bfbb60",
        "#f47942", "#fbb04e", "#b66353", "#d7ce9f", "#b9aa97",
        "#7e756d", "#8175aa", "#6fb899", "#31a1b3", "#ccb22b",
        "#a39fc9", "#94d0c0", "#959c9e", "#027b8e", "#9f8f12"],
    

]
//顏色數值(預設)
let color = colorBox[0];
//Fontfix
function createFormatter(formatterConfig) {
    return function(value, ctx) {
        let result = value;
        //let result = value.toFixed(formatterConfig.decimalPlaces);
        let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
        let percentage = (value * 100 / sum).toFixed(formatterConfig.decimalPlaces);
        if(formatterConfig.dataShow){
            result = formatterConfig.prefix + result + formatterConfig.suffix;
            if(formatterConfig.percentageShow){
                result = result + "\n" +percentage + "%"
            }
        }
        else{
            if(formatterConfig.percentageShow){
                result = percentage + "%"
            }
        }
        return result
    };
}
//轉換HEX to ARGB
function adjustColor(color,alpha) {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    if(alpha){
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    else{
        return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }  
}


function autoFontColor(color){
    let luminance = getLuminance(color);
    let textColor = luminance > 128 ? 'black' : 'white';
    return textColor
}
function getLuminance(hex) {
    let rgb = parseInt(hex.slice(1), 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >>  8) & 0xff;
    let b = (rgb >>  0) & 0xff;
    let luma = 0.299 * r + 0.587 * g + 0.114 * b; // sRGB luminance
    return luma;
}

$(function () {
    //chart.js 插件
    Chart.register(ChartDataLabels,{
        // 自定義插件來繪製中心文字
        id: 'centerText',
        afterDraw: (chart, args, options) => {
            if (chart.config.options.chartType == 'progress') {
                let { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
                

                ctx.save();
                let fontSize = Math.min(width, height) / 5;
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = chart.config.options.centerTxtColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                let textX = width / 2 + left;
                let nutextYm;
                if(chart.config.data.datasets[0].circumference == 180){
                    textY = bottom - height / 3.5;
                }
                else{
                    textY = (top + bottom) / 2;
                }
                

                // 從 chart 的 options 中獲取目標進度
                let targetProgress = chart.config.data.datasets[0].data[0]


                ctx.fillText(`${targetProgress}%`, textX, textY);
                ctx.restore();
            }

        },
    });

    $(window).on('resize', function() {
        let grid = GridStack.initAll()
        for(let i = 0;i < grid.length;i++){
            let isOneColumnMode = $(window).width() < 768 && grid[i].opts.columnOpts;
            if (isOneColumnMode) {
                grid[i].cellHeight(100)
            }else{
                grid[i].cellHeight("auto")
            }
        }
    });
});


function tableDraw(ID, data){
    $(`[gs-id=${ID}]`).find(".DB_body").append($('<div>',{'id':"DB_hint"+ID, 'style': 'width: 100%;'})
        .append($('<table>',{'id':"DB_table"+ID}))
    )
    // 準備 Bootstrap Table 的數據
    let tableData = data.datasets.map(dataset => {
        let row = { "Dataset": dataset.label };
        data.labels.forEach((label, index) => {
            row[label] = dataset.data[index].toFixed(2);
        });
        return row;
    });

    // 準備 Bootstrap Table 的列定義
    let columns = [
        { field: 'Dataset', title: '數據集 \\ 標籤', sortable: true }
    ].concat(data.labels.map(label => ({
        field: label,
        title: label,
        sortable: true
    })));

    $("#DB_table" + ID).bootstrapTable({
        columns: columns,
        data: tableData,
        striped: true,
        pagination: true,
        //showColumns: true,
        onPostBody: function() {
            // 移除分頁信息
            $('.fixed-table-pagination .pagination-info').remove();
            $(".page-list").contents().filter(function() {
                return this.nodeType === 3;
            }).remove();
        }
    });
}

function keyHTML(data, ID){
    $("#keyspace"+ID).empty()
    for(let i = 0; i < data.length; i++){
        $("#keyspace"+ID).append(
            `<div>
                <div class="keyValueItem" style="background-color: ${color[i]};padding: 1rem;border-radius: 8px; position: relative;overflow: hidden;">
                    <div class="keyValue" style="position: relative; z-index: 2;color: ${autoFontColor(color[i])};">
                        <div style="font-size: calc(0.8rem + 0.5vw);">${data[i].Key}</div>
                        <div style="font-size: calc(1rem + 0.8vw);font-weight: bold;">${data[i].Value}</div>
                    </div>
                    <div class="icon" style="position: absolute; top: 50%; right: 5%; transform: translateY(-50%); font-size: 80px; opacity: 0.5; z-index: 1; color: ${autoFontColor(color[i])};">
                        ${data[i].Icon}
                    </div>
                </div>
            </div>`
        )
    }
}

/*
讀取GS架構跟ChartJS圖表.
@param  {String}    elID        要呈現圖表的元素ID.
@param  {Object}    template    JSON模板/布局(來自編輯器).
*/
function loadTemplate(gridID, template){
    return new Promise((resolve, reject) => {
        let grid
        let $grid = $("#"+gridID)
        $grid.empty()
        let widget = template.widget;
        let widgetSet = template.widgetSet;
        let configs = template.config;
        color = colorBox[template.colorType]
        let GridStackSet = template.GridStackSet;
        $grid.append(`<div class="grid-stack" style="background-color: ${GridStackSet};" colorType=${template.colorType}></div>`)
        grid = GridStack.addGrid($grid.find(".grid-stack")[0],widget)
        grid.enableMove(false);
        grid.enableResize(false);

        $(document).ready(function (){
            let maxId = 0;
            $grid.find('[gs-id]').each(function () {
                let currentId = parseInt($(this).attr('gs-id'), 10);
                if (currentId > maxId) {
                    maxId = currentId;
                }
            });

            let widgetIndex = maxId+1;


            for(let i=1; i < widgetIndex+1; i++){
                if(widgetSet[i]){
                    $grid.find(`[gs-id=${i}]`).find(".grid-stack-item-content").css(widgetSet[i])
                    $grid.find(`[gs-id=${i}]`).find(".grid-stack-item-content .widgetShow").css('display','none')
                    if(!($grid.find(`[gs-id=${i}]`).find(".DB_body").attr('wg-type') == 'custom')){
                       $grid.find(`[gs-id=${i}]`).find(".grid-stack-item-content").append(
                            `<div id="loading" style="position: absolute; top: 50%; left:50%; transform: translate(-50%, -50%)">
                                <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;"></div>
                            </div>`
                        ) 
                    }
                    
                }
                
            }

            for(let i=1; i < widgetIndex+1; i++){   
                if(configs[i]){
                    let config = JSON.parse(configs[i])
                    if($grid.find("#DB_chart" + i)){
                        if(config.options.plugins.datalabels.fontFix){
                            config.options.plugins.datalabels.formatter = createFormatter(config.options.plugins.datalabels.fontFix)
                        }
                        new Chart($grid.find("#DB_chart" + i), config);
                    }
                    
                }
            }
            $grid.find('[id]').not($grid).each(function(){
                let originalId = $(this).attr('id'); // 获取原来的 id
                let newId = originalId + '_' +  $grid.attr("id"); // 生成新的 id
                $(this).attr('id', newId); // 设置新的 id
            });
            $grid.find('[gs-id]').each(function(){
                let originalId = $(this).attr('gs-id');
                let newId = originalId + '_' +  $grid.attr("id"); 
                $(this).attr('gs-id', newId); 
            });
        
            resolve();
        })
    })
}

/*
指定widget匯入資料.
@param  {String}    widgetID    要匯入資料的widget ID.
@param  {Object[]}  data        資料陣列 (need to discuss).
@return {Boolean}   資料匯入的結果，true 資料格式正常，false資料格式有誤.
*/
function importData(gridID, widgetID, inputData){
    widgetID = widgetID + "_" + gridID
    color = colorBox[$("#"+gridID).find(".grid-stack").attr("colorType")]
    try{
        let type = $(`[gs-id=${widgetID}]`).find(".DB_body").attr("wg-type")
        if(["bar", "line", "doughnut", "pie", "radar"].includes(type)){
            let config = Chart.getChart("DB_chart"+widgetID).config
            coverChartData(type, config, inputData)
            Chart.getChart("DB_chart"+widgetID).update()
        }
        else{
            coverOthersData(widgetID,type,inputData)
        }
        

        $(`[gs-id=${widgetID}]`).find("#loading_"+gridID).remove()
        $(`[gs-id=${widgetID}]`).find(".widgetShow").css('display','block')
        return true
    }catch{
        return false
    }
    
}

function coverChartData(type, config, inputData){
    let dataset = config.data.datasets[0]
    config.data.datasets = []
    config.data.labels = inputData.labels
    switch (type){
        case 'bar':
            for(let i = 0 ;i < inputData.datasets.length; i++){
                let baseColor = color[i % color.length];
                config.data.datasets.push({
                    ...dataset,
                    label: inputData.datasets[i].label,
                    data: inputData.datasets[i].data,
                    backgroundColor: adjustColor(baseColor),
                })
            }
            break;
        case 'line':
            for(let i = 0 ;i < inputData.datasets.length; i++){
                let baseColor = color[i % color.length];
                config.data.datasets.push({
                    ...dataset,
                    label: inputData.datasets[i].label,
                    data: inputData.datasets[i].data,
                    backgroundColor: adjustColor(baseColor,0.2),
                    borderColor: adjustColor(baseColor),
                })
            }
            break;
        case 'doughnut':
            dataset.backgroundColor = []
            for (let i = 0; i < inputData.datasets[0].data.length; i++) {
                let baseColor = color[i % color.length];
                dataset.backgroundColor.push(adjustColor(baseColor));
            }
            for(let i = 0 ;i < inputData.datasets.length; i++){
                config.data.datasets.push({
                    ...dataset,
                    label: inputData.datasets[i].label,
                    data: inputData.datasets[i].data,
                })
            }
            break;
        case 'pie':
            dataset.backgroundColor = []
            for (let i = 0; i < inputData.datasets[0].data.length; i++) {
                let baseColor = color[i % color.length];
                dataset.backgroundColor.push(adjustColor(baseColor));
            }
            for(let i = 0 ;i < inputData.datasets.length; i++){
                config.data.datasets.push({
                    ...dataset,
                    label: inputData.datasets[i].label,
                    data: inputData.datasets[i].data,
                })
            }
            break;
        case 'radar':
                for(let i = 0 ;i < inputData.datasets.length; i++){
                    let baseColor = color[i % color.length];
                    config.data.datasets.push({
                        ...dataset,
                        label: inputData.datasets[i].label,
                        data: inputData.datasets[i].data,
                        backgroundColor: adjustColor(baseColor,0.2),
                        borderColor: adjustColor(baseColor),
                    })
                }
                break;
    }
}

function coverOthersData(widgetID,type,inputData){
    switch (type){
        case "table":
            $(`[gs-id=${widgetID}]`).find(".DB_body").empty()
            tableDraw(widgetID, inputData)
            break;
        case "progress":
            if(Chart.getChart("DB_chart"+widgetID)){
                let config = Chart.getChart("DB_chart"+widgetID).config
                config.data.datasets[0].data =[inputData,100-inputData]
                Chart.getChart("DB_chart"+widgetID).update()
            }
            else{
                $(`[gs-id=${widgetID}]`).find(".progress-bar").css({
                    'width':`${inputData}`
                })
                $(`[gs-id=${widgetID}]`).find(".progress-bar").text(inputData)
            }
            break;
        case "key":
            keyHTML(inputData, widgetID)
            break;
        case "custom":
            $(`[gs-id=${widgetID}]`).find(".DB_body").empty()
            $(`[gs-id=${widgetID}]`).find(".DB_body").append(inputData)
            break;
        case "mix":
            let config = Chart.getChart("DB_chart"+widgetID).config
            config.data.labels = inputData.labels
            config.data.datasets[0].label = inputData.datasets[0].label
            config.data.datasets[1].label = inputData.datasets[1].label
            config.data.datasets[0].data = inputData.datasets[0].data
            config.data.datasets[1].data = inputData.datasets[1].data
            Chart.getChart("DB_chart"+widgetID).update()
            break;
    }
}





/*
指定widget匯入顏色.
@param  {String}    widgetID    要匯入資料的widget ID.
@param  {Object[]}  inputColor  顏色陣列 (need to discuss) example:['#FF7575','#FFAAD5','#D3A4FF'].
@return {Boolean}   資料匯入的結果，true 顏色格式正常，false顏色格式有誤.
*/
function changeWidgetColor(gridID, widgetID, inputColor){
    let tempColor = [...inputColor, ...color.slice(inputColor.length)];
    widgetID = widgetID + "_" + gridID
    try{
        let type = $(`[gs-id=${widgetID}]`).find(".DB_body").attr("wg-type")
        if(["bar", "line", "doughnut", "pie", "radar"].includes(type)){
            let config = Chart.getChart("DB_chart"+widgetID).config
            coverChartColor(type, config, tempColor)
            Chart.getChart("DB_chart"+widgetID).update()
        }
        else{
            coverOthersColor(widgetID,type,tempColor)
        }
        return true
    }catch{
        return false
    }
}

function coverChartColor(type, config, inputColor){
    let datasets = config.data.datasets
    let newColor = []
    switch (type){
        case 'bar':
            for(let i = 0 ;i < datasets.length; i++){
                let baseColor = inputColor[i % inputColor.length];
                config.data.datasets[i].backgroundColor = adjustColor(baseColor);
            }
            break;
        case 'line':
            for(let i = 0 ;i < datasets.length; i++){
                let baseColor = inputColor[i % inputColor.length];
                config.data.datasets[i].backgroundColor = adjustColor(baseColor,0.2);
                config.data.datasets[i].borderColor = adjustColor(baseColor);
            }
            break;
        case 'doughnut':
            for (let i = 0; i < datasets[0].data.length; i++) {
                let baseColor = inputColor[i % inputColor.length];
                newColor[i] = adjustColor(baseColor);
            }
            for(let i = 0 ;i < datasets.length; i++){
                config.data.datasets[i].backgroundColor = newColor;
            }
            break;
        case 'pie':
            for (let i = 0; i < datasets[0].data.length; i++) {
                let baseColor = inputColor[i % inputColor.length];
                newColor[i] = adjustColor(baseColor);
            }
            for(let i = 0 ;i < datasets.length; i++){
                config.data.datasets[i].backgroundColor = newColor;
            }
            break;
        case 'radar':
            for(let i = 0 ;i < datasets.length; i++){
                let baseColor = inputColor[i % inputColor.length];
                config.data.datasets[i].backgroundColor = adjustColor(baseColor,0.2);
                config.data.datasets[i].borderColor = adjustColor(baseColor);
            }
            break;
    }
}

function coverOthersColor(widgetID,type,inputColor){
    switch (type){
        case "table":
            $(`[gs-id=${widgetID}]`).find(".DB_body").empty()
            newTableDraw(widgetID, inputData)
            break;
        case "progress":
            if(Chart.getChart("DB_chart"+widgetID)){
                let config = Chart.getChart("DB_chart"+widgetID).config
                config.data.datasets[i].backgroundColor[0] = adjustColor(inputColor[0]);
                Chart.getChart("DB_chart"+widgetID).update()
            }
            else{
                $(`[gs-id=${widgetID}]`).find(".progress-bar").css({
                    'background-color': adjustColor(inputColor[0]),
                })
            }
            break;
        case "key":
            let i = 0;
            $(`[gs-id=${widgetID}]`).find(".keyValueItem").each(function() {
                $(this).css("background-color",inputColor[i])
                $(this).find('.keyValue').css('color',autoFontColor(inputColor[i]))
                $(this).find('.icon').css('color',autoFontColor(inputColor[i]))
                i++;
            })
            break;
        case "custom":
            break;
        case "mix":
            let config = Chart.getChart("DB_chart"+widgetID).config
            config.data.datasets[0].backgroundColor = adjustColor(inputColor[0])
            config.data.datasets[1].backgroundColor = adjustColor(inputColor[2])
            Chart.getChart("DB_chart"+widgetID).update()
            break;
    }
}

function changeGridColor(gridID, inputColor){
    let tempColor = [...inputColor, ...color.slice(inputColor.length)];
    let idList = []
    for(let i = 0;i < $("#"+gridID).find("[gs-id]").length;i++){
        idList[i] = $("#"+gridID).find("[gs-id]")[i].gridstackNode.id
    }
    try{
        for(let i = 0;i < idList.length;i++){
                changeWidgetColor(gridID, idList[i], tempColor)
            
        }
        return true
    }catch{
        return false
    }
    
}


//文本區域
function changeTxtArea(gridID, widgetID, inputHTML){
    widgetID = widgetID + "_" + gridID
    try{
        $(`[gs-id=${widgetID}]`).find(".DB_textArea").empty()
        $(`[gs-id=${widgetID}]`).find(".DB_textArea").append(inputHTML)
        let height = parseInt($(`[gs-id=${widgetID}]`).find(".DB_textArea").height())
        let originalHeight = parseInt($(`[gs-id=${widgetID}]`).find(".DB_body").height())
        $(`[gs-id=${widgetID}]`).find(".DB_body").css('height',`${originalHeight-height}px`)
        return true
    }catch{
        return false
    }
    
}
//改變headerTXT
function headerTxt(gridID, widgetID, String){
    widgetID = widgetID + "_" + gridID
    try{
        $(`[gs-id=${widgetID}]`).find(".DB_header").find("h6").text(`${String}`)
        return true
    }catch{
        return false
    }
}


//toJPG
function gridToJPG(gridID){
    html2canvas($("#"+gridID)[0], {
        scale: 5,
        onrendered: function(canvas) {
            let imgData = canvas.toDataURL("image/jpeg");
            let link = document.createElement('a');
            link.href = imgData;
            link.download = `${gridID}.jpg`;
            link.click();
        }
    });
}

function widgetToJPG(gridID, widgetID) {
    let $element = $(`[gs-id=${widgetID}_${gridID}]`).find(".grid-stack-item-content");
    let bgColor = $element.css("background-color");
    let newBgColor = bgColor.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d\.]+\)/, 'rgba($1, $2, $3, 1)');
    $element.css("background-color", newBgColor);

    html2canvas($element[0], { 
        scale: 5,
        onrendered:function(canvas) {
        let imgData = canvas.toDataURL("image/jpeg");
        let link = document.createElement('a');
        link.href = imgData;
        link.download = `${gridID}-${widgetID}.jpg`;
        link.click();
        
        $element.css("background-color", bgColor);
        }
    })
}