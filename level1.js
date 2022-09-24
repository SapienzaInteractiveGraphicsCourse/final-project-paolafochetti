import * as THREE from './three.js-master/build/three.module.js';
import * as GLTF from './three.js-master/loaders/GLTFLoader.js';
import * as LOADER from './three.js-master/src/loaders/LoadingManager.js';
import * as UTIL from './common/utilities.js';
import * as ANIMATION from './common/animation.js';
import {Racoon} from './common/player.js';
import {World} from './common/world.js';


var racoon;
var platform;
var spaceShip;

var bracelet;
var treasureLight;
var baseTreasure;
var signal, text;
var columnTreasure;
var objects=[];



var lavaGround;
var stoneGround;
var AmbientOcclusion,BaseColor,Height,Material,Normal,Roughness;
var PlanetAmbientOcclusion,PlanetBaseColor,PlanetHeight,PlanetMaterial,PlanetNormal,PlanetRoughness;
var LavaAmbientOcclusion, LavaBaseColor, LavaHeight, LavaNormal, LavaSpecular;
var LavaStoneAmbientOcclusion, LavaStoneBaseColor, LavaStoneHeight, LavaStoneNormal, LavaStoneSpecular;

var platform1, platform2, platform3, platform4, platform5, platform6, platform7, platform8, platform9, platform10;
var plane1,plane2, plane3, plane4, plane5, plane6, plane7, plane8, plane9, plane10, plane11, plane12;

var materialLava,materialStone, materialStoneLava;
var background;

var clock;

var lifeModel1, lifeModel2, lifeModel3;
var world = new World(); 

const manager = new LOADER.LoadingManager();
const progressBar = document.getElementById("progress-bar");
const progressBarDiv = document.querySelector(".progress-bar-container");
manager.onProgress = function(url,loaded,total){progressBar.value = (loaded/total)*100;}

manager.onLoad = function(){
 		progressBarDiv.style.display="none";
 		init();
 	}


window.onload = loadModels();

function loadModels(){
	
 	const loader = new GLTF.GLTFLoader(manager);

	loader.load("/models/racoon.glb", 
				function(glb){
			  		racoon = new Racoon(glb.scene.children[0]);
			  		racoon.root.position.x = 0 ;
			  		racoon.root.position.y = -0.37 ;
			  		racoon.root.position.z = 0 ;
			  		racoon.root.rotation.y = 90*Math.PI/180;
			  		racoon.model.position.set(0,  0.35, 0);
			  		racoon.level=1;
			  		racoon.checkPoint = racoon.model.position.clone();

				},undefined, function(error){console.error(error);});

	//life
	loader.load("/models/heart/scene.gltf", 
				function(glb){
			  		lifeModel1 = glb.scene;
			  		lifeModel1.name='life1';
			  		lifeModel2=lifeModel1.clone();
			  		lifeModel2.name='life2';
			  		lifeModel3=lifeModel1.clone();
			  		lifeModel3.name='life3';

			  		lifeModel1.scale.set(0.2,0.2,0.2)
			  		lifeModel2.scale.set(0.2,0.2,0.2)
			  		lifeModel3.scale.set(0.2,0.2,0.2)

				},undefined, function(error){console.error(error);});
	
	//spaceship
	loader.load("/models/level1/spaceShip.glb", 
				function(glb){
			  		spaceShip = glb.scene.children[0];
			  		spaceShip.name='spaceShip';
			  		spaceShip.visible=false;
			  		spaceShip.scale.set(0.2,0.2,0.2)
			  	},undefined, function(error){console.error(error);});

	//treasure
	loader.load("/models/level1/Bracelet platform.glb", 
		function(glb){
	  		platform = glb.scene;
	  		platform.name = 'treasurePlatform';
			platform.position.x = 14.5;
			platform.position.y = -0.2;
			platform.castShadow=true;
			bracelet = platform.children[0];
			bracelet.name='treasure';
			bracelet.material.visible=true;
			bracelet.rotation.y = -90*Math.PI/180;
			baseTreasure = platform.children[1].children[0];
			baseTreasure.name='baseTreasure';
			baseTreasure.rotation.y = -90*Math.PI/180;
			baseTreasure.visible=false
			
			columnTreasure = platform.children[1].children[1];
			columnTreasure.name='columnTreasure';
			columnTreasure.rotation.y = -90*Math.PI/180;
			signal = platform.children[1].children[2];
			signal.name = 'signal';
			signal.rotation.y = -90*Math.PI/180;
			text = platform.children[1].children[3];
			text.name = 'text';
			text.rotation.y = -90*Math.PI/180;

			UTIL.enlight(bracelet,5);}, 

		undefined, function(error){console.error(error);});

	//platforms
	loader.load("/models/level1/platform.glb",function(glb){
		platform1 = glb.scene;
		platform2 = platform1.clone();
		platform3 = platform1.clone();
		platform4 = platform1.clone();
		platform5 = platform1.clone();
		platform6 = platform1.clone();
		platform7 = platform1.clone();
		platform8 = platform1.clone();
		platform9 = platform1.clone();
		platform10 = platform1.clone();
	},undefined, function(error){console.error(error);});

	//textures
	const textLoader = new THREE.TextureLoader(manager);

	AmbientOcclusion = textLoader.load("/texture/level1/stone/AmbientOcclusion.jpg");
	BaseColor = textLoader.load("/texture/level1/stone/BaseColor.jpg");
	Height = textLoader.load("/texture/level1/stone/Height.png");
	Material = textLoader.load("/texture/level1/stone/Material.jpg");
	Normal = textLoader.load("/texture/level1/stone/Normal.jpg");
	Roughness = textLoader.load("/texture/level1/stone/Roughness.jpg");
	
	LavaAmbientOcclusion = textLoader.load("/texture/level1/lava/AmbientOcclusion.png");
	LavaBaseColor = textLoader.load("/texture/level1/lava/BaseColor.png");
	LavaHeight = textLoader.load("/texture/level1/lava/Height.png");
	LavaNormal = textLoader.load("/texture/level1/lava/Normal.png");
	LavaSpecular = textLoader.load("/texture/level1/lava/Specular.png");

	LavaStoneAmbientOcclusion = textLoader.load("/texture/level1/lavaStone/AmbientOcclusion.png");
	LavaStoneBaseColor = textLoader.load("/texture/level1/lavaStone/BaseColor.png");
	LavaStoneHeight = textLoader.load("/texture/level1/lavaStone/Height.png");
	LavaStoneNormal = textLoader.load("/texture/level1/lavaStone/Normal.png");
	LavaStoneSpecular = textLoader.load("/texture/level1/lavaStone/Specular.png");

	background = textLoader.load("/texture/background.png");
}

function init(){

	//initialize vocal interface clock
	clock = 0;
	talk();

	//set background
	world.scene.background = background;
	world.sceneTop.background = background;

	//scene adding
	world.scene.add(racoon.model);
	world.scene.add(platform);
	world.sceneTop.add(lifeModel1);
	world.sceneTop.add(lifeModel2);
	world.sceneTop.add(lifeModel3);

	//position lives
	lifeModel1.position.set(0,5.5,-10)
	lifeModel2.position.set(0,5.5,-9.5)
	lifeModel3.position.set(0,5.5,-9)

	lifeModel1.rotation.y=90*Math.PI/180;
	lifeModel2.rotation.y=90*Math.PI/180;
	lifeModel3.rotation.y=90*Math.PI/180;

	//create ground
	createGround(world.scene);
	racoon.position=stoneGround;

	//position spaceship
	plane2.add(spaceShip);
	spaceShip.position.set(0,-0.5,0.45)
	spaceShip.rotation.x=180*Math.PI/180
	createBBox(spaceShip)

	
	materialStoneLava = new THREE.MeshPhysicalMaterial({
		attenuationDistance: 0.4,
		reflectivity:0.0,
		side: THREE.DoubleSide,
		map: LavaStoneBaseColor,
		normalMap: LavaStoneNormal,
		specularColorMap:LavaStoneSpecular,
		specularIntensity: 0.4,
		roughness: 1.0,
		aoMap: LavaStoneAmbientOcclusion});

	world.setPlanetMaterial(materialStoneLava);


	world.camera.lookAt(racoon.model.position);
	
	// create bounding box
	createBBox(columnTreasure);
	createBBox(baseTreasure);

	//create platforms
	positionPlatforms(world.scene);



	
	document.onkeydown = function(key){

		if(racoon.grab && clock==1){
			racoon.canWalk=false;
			talk();
		}
		
		switch (key.keyCode){

			case 87: //W
				racoon.pressed[0]=true;
				break;

			case 68: //D
				racoon.pressed[1]=true;
				break;

			case 65: //A
				racoon.pressed[2]=true;
				break;

			case 83: //S
				racoon.pressed[3]=true;
				break;		

			case 82: //R
				if(racoon.dead==true){
					world.reset();
					setTimeout(()=>{loadModels()},5);
				}				
				break;	

			case 78: //N
				if(world.completed){location.replace("./level2.html")}
				break;

			case 77: //M
				if(world.completed || racoon.dead){location.replace("./main.html")}
				break;	
			
			case 37: //left <-
						world.camera.position.x+=1*Math.PI/180
						break;
			case 39: //right ->
						world.camera.position.x-=1*Math.PI/180
						break;

			case 71: //G
				if (racoon.grab==true){
					ANIMATION.grabTreasure(racoon);
					racoon.stolen=true;
					setTimeout(()=>{
						ANIMATION.treasureAnimation(bracelet,world, racoon.level);
						activateLava();
						talk();
					},790);
				}
				break;
			case 32: //spacebar
				if (racoon.canJump){
					racoon.startingJump = racoon.model.position.clone()
					racoon.canJump=false;
					ANIMATION.jump(racoon,2,world,objects);}
				setTimeout(()=>{
					racoon.canWalk=true;
					racoon.canJump=true;},2000)

				break;
		}	
	}

	document.onkeyup = function(key){
		
		switch (key.keyCode){

			case 87: //W
				racoon.pressed[0]=false;
				break;

			case 68: //D
				racoon.pressed[1]=false;
				break;

			case 65: //A
				racoon.pressed[2]=false;
				break;

			case 83: //S
				racoon.pressed[3]=false;
				break;				
		}
	}
	var interval = window.setInterval(function(){
		if(racoon.grab){racoon.canWalk=false;}

		if(racoon.pressed.includes(true) && world.sceneTop.getObjectByName( 'life1')!=undefined){

			if(racoon.canWalk==true && racoon.canJump==true){

				racoon.canWalk=false;
				ANIMATION.move(racoon,world)
				ANIMATION.moveLegs(racoon);
				setTimeout(()=>{
					racoon=ANIMATION.whereAmI(racoon,objects,world);
					if (racoon.canWalk==false && racoon.position.includes('plane') &&racoon.stolen==true){setTimeout(()=>{racoon.canWalk=true},100)}
					if (racoon.position.name=='plane6' && racoon.stolen==true){talk();}

				},100)
			}
			else if(racoon.canWalk==true && racoon.canJump==false ){ANIMATION.move(racoon,world)}
		}
		else if(racoon.position.name=='plane1'||racoon.position.name=='plane3'||racoon.position.name=='plane4'||racoon.position.name=='plane5'){racoon=ANIMATION.whereAmI(racoon,objects,world);}

	},310)
}

function createBBox(object){

	var bBox = new THREE.Box3().setFromObject(object, true);
	
	var geometry = new THREE.BoxGeometry(bBox.max.x-bBox.min.x,bBox.max.y-bBox.min.y,bBox.max.z-bBox.min.z);

	var bx = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({side: THREE.DoubleSide, wireframe:true,color:0x0000ff}));

	if(object.position.x==0 && object.position.y==0 && object.position.z==0){
		var center = new THREE.Vector3(0,0,0)
		bBox.getCenter(center)
		bx.position.x = center.x;
		bx.position.y = center.y;
		bx.position.z = center.z;

		var clone=bx.clone()
		clone.rotation.y = -90*Math.PI/180;
		clone.name = 'bBox'+object.name;
		clone.visible=false;
		object.add(clone)
	}

	if(object.name=='spaceShip'){
		bx.scale.set(3,4,10);
		bx.position.z=2
	}

	bx.rotation.y = 90*Math.PI/180;
	bx.name = 'bBox'+object.name;
	object.add(bx);
	bx.visible=false;
	return bx

}



function talk(){
	switch(clock){
		case 0:
		 	document.getElementById('ins').innerHTML = "Hello there, that's Oswin talking.\nDo you see that blue light ahead? That's your mission for today, let's go grab that treasure."
			break;

		case 1:
			document.getElementById('ins').innerHTML = "Now press 'G' to grab the treasure.";
			break;

		case 2:
			document.getElementById('ins').innerHTML = "Good Job, Captain! We now are far richer than before.";
			break;

		case 3:
			document.getElementById('ins').innerHTML = "Woho, something it's happening.";
			break;

		case 4:
			document.getElementById('ins').innerHTML = "All that glitters is not gold, sometimes it's lava.\nI was lucky to land where i left you, just find a road to go back to the starting point. I wait here, Captain.";
			break;

		case 5:
			document.getElementById('ins').innerHTML = "Good news, if you carefully look around there are some teleport platform, they will save you from lots of risks and lots of walking.\nThere is one one your left, good luck!";
			break;
	}
	clock+=1;

}


function activateLava(){

	objects.shift();
	objects.shift();
	objects.push(baseTreasure)
	objects.push(plane1)
	objects.push(plane2)
	objects.push(plane3)
	objects.push(plane4)
	objects.push(plane5)
	objects.push(plane6)
	objects.push(plane7)
	objects.push(plane8)
	objects.push(plane9)
	objects.push(plane10)
	objects.push(plane11)
	objects.push(plane12)
	objects.push(platform1)
	objects.push(platform2)
	objects.push(platform4)
	objects.push(platform5)
	objects.push(platform6)
	objects.push(platform7)
	objects.push(platform8)
	objects.push(platform3)
	objects.push(platform9)
	objects.push(lavaGround)

	lavaGround.visible=true;
	baseTreasure.visible=true
	platform1.visible = true;
	platform2.visible = true;
	platform3.visible = true;
	platform4.visible = true;
	platform5.visible = true;
	platform6.visible = true;
	platform7.visible = true;
	platform8.visible = true;
	platform9.visible = true;
	platform10.visible = true;
	
	signal.visible=false;
	text.visible=false;

	createjs.Tween.get(platform.position).to({y:1.1},2600);
	createjs.Tween.get(columnTreasure.position).to({y: -1 } ,2600);

	createjs.Tween.get(racoon.model.position).to({y: racoon.model.position.y +1.285 } ,2600);
	createjs.Tween.get(world.camera.position).to({y: world.camera.position.y +1.5 } ,2600);
	createjs.Tween.get(lavaGround.position).to({y: 1 } ,2500).wait(1500).call(raisePlatforms);
	talk()
}

function raisePlatforms(){

	columnTreasure.visible = false;
	stoneGround.visible=false;
	stoneGround.position.y=-10;
	createjs.Tween.get(platform1.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform2.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform3.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform4.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform5.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform6.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform7.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform8.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(platform9.position).to({y: 1.1 } ,2000);
	createjs.Tween.get(plane1.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane2.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(spaceShip.position).to({z: -0.1 } ,2500);
	createjs.Tween.get(plane3.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane4.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane5.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane6.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane7.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane8.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane9.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane10.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane11.position).to({y: 1.015 } ,2000);
	createjs.Tween.get(plane12.position).to({y: 1.015 } ,2000).wait(1000).call(activateAnimation);
	plane1.material = materialStoneLava;
	plane2.material = materialStoneLava;
	plane3.material = materialStoneLava;
	plane4.material = materialStoneLava;
	plane5.material = materialStoneLava;
	plane6.material = materialStoneLava;
	plane7.material = materialStoneLava;
	plane8.material = materialStoneLava;
	plane9.material = materialStoneLava;
	plane10.material = materialStoneLava;
	plane11.material = materialStoneLava;
	plane12.material = materialStoneLava;
}
		
function activateAnimation(){

	talk();
	spaceShip.visible=true;

	racoon.canWalk=true;
	racoon.checkPoint=racoon.model.position.clone()

	const lava = new THREE.MeshPhysicalMaterial({
		color: 0xff821d,
		attenuationDistance: 0.4,
		reflectivity:0.0,
		side: THREE.DoubleSide,
		map: LavaBaseColor,
		normalMap: LavaNormal,
		bumpMap: LavaHeight,
		emissive : 0xfff000,
		specularColorMap:LavaSpecular,
		specularIntensity: 0.4,
		specularColor: 0xff9b00,
		roughness: 1.0,
		aoMap: LavaAmbientOcclusion

	});
	
	//plane platforms
	createjs.Tween.get(plane3.position, {loop: true}).to({x: 24} ,30000).to({x: 39} ,30000)

	createjs.Tween.get(plane4.position, {loop: true}).to({z: -2} ,15000).to({z: 7} ,15000)

	createjs.Tween.get(plane5.rotation, {loop: true}).to({z: 180*Math.PI/180} ,8000)
	createjs.Tween.get(plane5.position, {loop: true}).to({x: 4},30000).to({x: 39},30000)

	createjs.Tween.get(plane1.rotation, {loop: true}).to({z: 180*Math.PI/180} ,8000)
	createjs.Tween.get(plane1.position, {loop: true}).to({z: 7},15000).to({z: 0},15000)
	
	createjs.Tween.get(plane2.rotation, {loop: true}).to({z: 180*Math.PI/180} ,8000)
	
}


function positionPlatforms(scene){
	const material = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		map: BaseColor,
		normalMap: Normal,
		roughnessMap:Roughness,
		roughness: 1.0,
		aoMap: AmbientOcclusion

	});
	var materialClone = new THREE.MeshStandardMaterial({
		color: 0x76f731,
		side: THREE.DoubleSide,
		emissive: 0xf1190a,
		map: BaseColor,
		normalMap: Normal,
		roughnessMap:Roughness,
		roughness: 1.0,
		aoMap: AmbientOcclusion

	});

	platform1.name = 'platform1';
	platform1.visible = false;
	platform1.position.set(27.5,0.09,0)
	platform1.castShadow = true;
	platform1.children[0].material=material;
	createBBox(platform1)
	scene.add(platform1);

	platform2.name='platform2'
	platform2.visible = false;
	platform2.position.set(35,0.09,0)
	platform2.castShadow = true;
	platform2.children[0].material=material;
	createBBox(platform2)
	scene.add(platform2);

	platform3.name='teleport1'
	platform3.visible = false;
	platform3.position.set(23,0.09,-7.1)
	platform3.castShadow = true;
	platform3.children[0].material=materialClone;
	UTIL.enlightTeleport(platform3, 10)
	createBBox(platform3)
	scene.add(platform3);

	platform4.name='platform4'
	platform4.visible = false;
	platform4.position.set(27,0.09,7.3)
	platform4.castShadow = true;
	platform4.children[0].material=material;
	createBBox(platform4)
	scene.add(platform4);

	platform5.name='platform5'
	platform5.visible = false;
	platform5.position.set(37,0.09,0)
	platform5.castShadow = true;
	platform5.children[0].material=material;
	createBBox(platform5)
	scene.add(platform5);

	platform6.name='platform6'
	platform6.visible = false;
	platform6.position.set(37,0.09,7.3)
	platform6.castShadow = true;
	platform6.children[0].material=material;
	createBBox(platform6)
	scene.add(platform6);

	platform7.name='platform7'
	platform7.visible = false;
	platform7.position.set(37,0.09,-7.1)
	platform7.castShadow = true;
	platform7.children[0].material=material;
	createBBox(platform7)
	scene.add(platform7);

	platform8.name='platform8'
	platform8.visible = false;
	platform8.position.set(2,0.09,9.3)
	platform8.castShadow = true;
	platform8.children[0].material=material;
	createBBox(platform8)
	scene.add(platform8);

	platform9.name='teleport2'
	platform9.visible = false;
	platform9.position.set(3,0.09,-4.5)
	platform9.castShadow = true;
	platform9.children[0].material = materialClone;
	UTIL.enlightTeleport(platform9, 10)
	createBBox(platform9)
	scene.add(platform9);
}




function modifytextures(){
	BaseColor.anisotropy=20
	Normal.anisotropy=50
	Height.anisotropy=50
	Roughness.anisotropy=50
	AmbientOcclusion.anisotropy=50

}


function createGround(scene){
	modifytextures();
	
	const geometry3 = new THREE.PlaneGeometry(60,30,100,100);
	const geometry4 = new THREE.PlaneGeometry(2,3,100,100);
	const geometry5 = new THREE.PlaneGeometry(1,5,100,100);

	materialStone = new THREE.MeshStandardMaterial({
		color: 0xffffff,//0x7a7a7a,
		side: THREE.DoubleSide,
		map: BaseColor,
		normalMap: Normal,
		displacementMap: Height,
		displacementScale:0.1,
		roughnessMap:Roughness,
		roughness: 1.0,
		aoMap: AmbientOcclusion

	});

	const materialPlatformStone = new THREE.MeshStandardMaterial({
		color: 0x70707a,
		side: THREE.DoubleSide,
		map: BaseColor,
		normalMap: Normal,
		displacementMap: Height,
		displacementScale:0.05,
		roughnessMap:Roughness,
		displacementBias:0.5,
		roughness: 1.0,
		aoMap: AmbientOcclusion

	});

	materialLava = new THREE.MeshPhysicalMaterial({
		color: 0xff821d,
		attenuationDistance: 0.4,
		reflectivity:0.0,
		side: THREE.DoubleSide,
		map: LavaBaseColor,
		normalMap: LavaNormal,
		bumpMap: LavaHeight,
		emissive : 0xff0000,
		specularColorMap:LavaSpecular,
		specularIntensity: 0.4,
		specularColor: 0xff9b00,
		roughness: 1.0,
		aoMap: LavaAmbientOcclusion

	});

	stoneGround = new THREE.Mesh(geometry3, materialStone);
	lavaGround = new THREE.Mesh(geometry3, materialLava);

	plane1 = new THREE.Mesh(geometry4, materialPlatformStone);
	plane2 = new THREE.Mesh(geometry4, materialPlatformStone);
	plane3 = new THREE.Mesh(geometry4, materialPlatformStone);
	plane4 = new THREE.Mesh(geometry4, materialPlatformStone);
	plane5 = new THREE.Mesh(geometry4, materialPlatformStone);
	plane6 = new THREE.Mesh(geometry5, materialPlatformStone);
	plane7 = new THREE.Mesh(geometry5, materialPlatformStone);
	plane8 = new THREE.Mesh(geometry5, materialPlatformStone);
	plane9 = new THREE.Mesh(geometry5, materialPlatformStone);
	plane10 = new THREE.Mesh(geometry5, materialPlatformStone);
	plane11 = new THREE.Mesh(geometry5, materialPlatformStone);
	plane12 = new THREE.Mesh(geometry5, materialPlatformStone);

	stoneGround.name='stoneGround'
	stoneGround.rotation.x = 90 * Math.PI/180;
	stoneGround.position.set(24.43,0,0);

	lavaGround.name='lavaGround'
	lavaGround.rotation.x = 90 * Math.PI/180;
	lavaGround.position.set(24.43,-0.2,0);	
	lavaGround.visible=false;

	plane1.name='plane1';
	plane1.rotation.x = 90*Math.PI/180;
	plane1.position.set(39.5,0.49,0);

	plane2.name='plane2';
	plane2.rotation.x = 90*Math.PI/180;
	plane2.position.set(0,0.489,-0.5);

	plane3.name='plane3';
	plane3.rotation.x = 90*Math.PI/180;
	plane3.position.set(39,0.49,-10);

	plane4.name='plane4';
	plane4.rotation.x = 90*Math.PI/180;
	plane4.position.set(3,0.495,7);

	plane5.name='plane5';
	plane5.rotation.x = 90*Math.PI/180;
	plane5.position.set(39,0.49,11);

	plane6.name='plane6';
	plane6.rotation.x = 90 * Math.PI/180;
	plane6.rotation.z = 90 * Math.PI/180;
	plane6.position.set(18,0.5,0)
	scene.add(plane6)

	plane7.name='plane7';
	plane7.rotation.x = 90 * Math.PI/180;
	plane7.rotation.z = 90 * Math.PI/180;
	plane7.position.set(24,0.485,0)
	scene.add(plane7)

	plane8.name='plane8';
	plane8.rotation.x = 90 * Math.PI/180;
	plane8.rotation.z = 90 * Math.PI/180;
	plane8.position.set(31,0.485,0)
	scene.add(plane8)


	plane9.name='plane9';
	plane9.rotation.x = 90 * Math.PI/180;
	plane9.position.set(35,0.485,-4)
	scene.add(plane9)

	plane10.name='plane10';
	plane10.rotation.x = 90 * Math.PI/180;
	plane10.position.set(26,0.485,4)
	scene.add(plane10)

	scene.add(stoneGround);
	scene.add(lavaGround);

	scene.add(plane1);
	scene.add(plane2);
	scene.add(plane3);
	scene.add(plane4);
	scene.add(plane5);

	objects.push(stoneGround)
}

