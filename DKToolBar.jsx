
function main(thisObj) {

	var icondir = new File(new File($.fileName).parent).fullName + "/DKToolBar_Icon/";

	var buttonPosition = [
			[5, 10, 45, 50],//0
			[50, 10, 90, 50],//1
			[95, 10, 135, 50],//2
			[140, 10, 180, 50],//3
			[185, 10, 225, 50],//4
			[230, 10, 270, 50],//5
			[275, 10, 315, 50],//6
			[320, 10, 360, 50],//7
			[365, 10, 405, 50],//8
			[410, 10, 450, 50],//9
			[455, 10, 495, 50],//10
			[500, 10, 540, 50],//11
			[545, 10, 585, 50],//12
			[590, 10, 630, 50],//13
			[635, 10, 675, 50],//14
			[680, 10, 720, 50],//15
			[725, 10, 765, 50],//16
			[770, 10, 810, 50],//17
			[815, 10, 855, 50],//18
			[860, 10, 900, 50],//19
			[905, 10, 945, 50],//20
		];

	buttonindex = 0;

	var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette" , "DKToolBar" , [100, 100, 500, 600] , {resizeable:true});

	var solid = panel.add('iconbutton', buttonPosition[buttonindex++], icondir + "solid.png");
	solid.helpTip = "平面を追加";

	var adjustment_layer = panel.add('iconbutton', buttonPosition[buttonindex++], icondir + "adjustment_layer.png");
	adjustment_layer.helpTip = "調整レイヤーを追加";

	var null_object = panel.add('iconbutton', buttonPosition[buttonindex++], icondir + "null.png");
	null_object.helpTip = "ヌルオブジェクトを追加";

	var camera = panel.add('iconbutton', buttonPosition[buttonindex++], icondir + "camera.png");
	camera.helpTip = "カメラを追加";

	var loop_expression = panel.add('iconbutton', buttonPosition[buttonindex++], icondir + "loop_expression.png");
	loop_expression.helpTip = "ループエクスプレッションを適応";

	var duplicate = panel.add('iconbutton', buttonPosition[buttonindex++], icondir + "duplicate.png");
	duplicate.helpTip = "選択レイヤーの複製";

	for (i = buttonindex; i <= 20; i++) {
		panel.add('iconbutton', buttonPosition[buttonindex++], icondir + "no.png").helpTip = "未設定";
	}


	function getActiveComp() {
		return app.project.activeItem;
	}

	function getCompLayers() {
		return getActiveComp().layers;
	}

	function getSelectLayers() {
		return getActiveComp().selectedLayers;
	}

	function setObject(object, selectedLayers, parent) {
		activeComp = getActiveComp();
		inPoint = 0;
		outPoint = activeComp.duration;
		index = 0;
		if(selectedLayers.length > 0) {
			inPoint2 = selectedLayers[0].inPoint;
			outPoint2 = 0;
			index2 = selectedLayers[0].index;
			for (i = 0; i < selectedLayers.length; i++) {
				selectLayer = selectedLayers[i];

				if(inPoint2 > selectLayer.inPoint)
					inPoint2 = selectLayer.inPoint;

				if(outPoint2 < selectLayer.outPoint)
					outPoint2 = selectLayer.outPoint;

				if(index2 > selectLayer.index)
					index2 = selectLayer.index;

				if(parent)
					selectLayer.parent = activeComp.layer(object.index);
			}
			inPoint = inPoint2;
			outPoint = outPoint2;
			index = index2;
		}

		object.inPoint = inPoint;
		object.outPoint = outPoint;
		object.moveAfter(activeComp.layer(--index));
	}

	function centerAnchorPoint(layer) {
		comp = layer.containingComp;
		curTime = comp.time;
		layerAnchor = layer.anchorPoint.value;
		x = layer.sourceRectAtTime(curTime, false).width / 2;
		y = layer.sourceRectAtTime(curTime, false).height / 2;
		x += layer.sourceRectAtTime(curTime, false).left;
		y += layer.sourceRectAtTime(curTime, false).top;
		xAdd = (x - layerAnchor[0]) * (layer.scale.value[0] / 100);
		yAdd = (y - layerAnchor[1]) * (layer.scale.value[1] / 100);
		layer.anchorPoint.setValue([x, y]);
		layerPosition = layer.position.value;
		layer.position.setValue([layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2]]);
	}


	solid.onClick = function() {
		activeComp = getActiveComp();
		selectedLayers = getSelectLayers();
		object = getCompLayers().addSolid([0, 0, 0], "Solid", activeComp.width, activeComp.height, activeComp.pixelAspect);
		setObject(object, selectedLayers, false);
	}

	adjustment_layer.onClick = function() {
		activeComp = getActiveComp();
		selectedLayers = getSelectLayers();
		object = getCompLayers().addSolid([1, 1, 1], "AdjustmentLayer", activeComp.width, activeComp.height, activeComp.pixelAspect);
		object.adjustmentLayer = true;
		object.label = 5;
		setObject(object, selectedLayers, false);
	}

	null_object.onClick = function() {
		activeComp = getActiveComp();
		selectedLayers = getSelectLayers();
		object = getCompLayers().addNull();
		object.label = 2;
		centerAnchorPoint(object);
		setObject(object, selectedLayers, true);
	}

	camera.onClick = function() {
		activeComp = getActiveComp();
		selectedLayers = getSelectLayers();
		object = getCompLayers().addCamera("Camera", [activeComp.width/2 , activeComp.height/2]);
		object.label = 4;
		object.autoOrient = AutoOrientType.ALONG_PATH;
		object.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
		setObject(object, selectedLayers, false);
	}

	loop_expression.onClick = function() {
		selectedLayers = getSelectLayers();
		for (i = 0; i < selectedLayers.length; i++) {
			selectLayer = selectedLayers[i];
			selectLayer.timeRemapEnabled = true;
			selectLayer.property("ADBE Time Remapping").expression = 'loopOut(type="cycle")';
		}
	}

}

app.beginUndoGroup("DKToolBar");
main(this);
app.endUndoGroup();