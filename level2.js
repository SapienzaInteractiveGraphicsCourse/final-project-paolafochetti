import * as THREE from 'three';
import * as GLTF from 'gltf';
import * as UTIL from 'utilities';
import * as ANIMATION from 'animation';
import * as LOADER from 'loader';
import {Racoon} from 'player';
import {World} from 'world';


var racoon;
var treasure;
var crystal;

var objects=[];

var shark, shark1, shark2, shark3, shark4, shark5;
var buoy, buoy1, buoy2, buoy3, buoy4, buoy5;
var fish, fish1, fish2, fish3, fish4, fish5;
var lifesaver, lifesaver1, lifesaver2, lifesaver3, lifesaver4, lifesaver5;
var teleports=[];

var probabilityClock=0;
			
var waterGround;

var AmbientOcclusion,BaseColor,Height,Specular,Normal;
var PlanetAmbientOcclusion,PlanetBaseColor,PlanetHeight,PlanetMaterial,PlanetNormal,PlanetRoughness;
var crystalAmbientOcclusion,crystalRoughness,crystalHeight,crystalNormal,crystalBaseColor;
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
 	
 	//racoon
	loader.load("/models/racoon.glb", 
				function(glb){
			  		racoon = new Racoon(glb.scene.children[0]);
			  		skeletonPositioning();
			  		
			  		racoon.model.position.set(0,  0.35, 0);
			  		racoon.level = 2;
			  		racoon.checkPoint = racoon.model.position.clone();
				},undefined, function(error){console.error(error);});

	//crystal ball
	loader.load("/models/level2/crystalBall.glb", 
				function(glb){
			  		crystal = glb.scene.children[0].children[0];
			  		crystal.name='crystal';
			  		crystal.position.set(-0.5,0.5,0)
			  		crystal.scale.set(0.1,0.1,0.1);			  		
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
			  		lifeModel1.scale.set(0.2,0.2,0.2);
			  		lifeModel2.scale.set(0.2,0.2,0.2);
			  		lifeModel3.scale.set(0.2,0.2,0.2);

				},undefined, function(error){console.error(error);});

	//lifesaver
	loader.load("/models/level2/lifesaver.glb", function(glb){lifesaver = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/lifesaver.glb", function(glb){lifesaver1 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/lifesaver.glb", function(glb){lifesaver2 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/lifesaver.glb", function(glb){lifesaver3 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/lifesaver.glb", function(glb){lifesaver4 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/lifesaver.glb", function(glb){lifesaver5 = glb.scene.children[0];},undefined, function(error){console.error(error);});

	//shark
	loader.load("/models/level2/hammerheadShark.glb", function(glb){shark = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/hammerheadShark.glb", function(glb){shark1 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/hammerheadShark.glb", function(glb){shark2 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/hammerheadShark.glb", function(glb){shark3 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/hammerheadShark.glb", function(glb){shark4 = glb.scene.children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/hammerheadShark.glb", function(glb){shark5 = glb.scene.children[0];},undefined, function(error){console.error(error);});

	//buoy
	loader.load("/models/level2/buoy.glb", function(glb){
			  		buoy = glb.scene.children[0].children[0];
			  		buoy.rotation.x=-90*Math.PI/180;
			  		buoy.name='buoy';
			  		buoy.children[1].children[0].castShadow=true;
			  		buoy.children[1].children[0].material.color.r=0.71;
			  		buoy.children[1].children[0].material.color.g=0.07;
			  		buoy.children[1].children[0].material.color.b=0.03;
			  		buoy.children[1].children[0].material.color.set(0x640d04);
			  		buoy.children[1].children[0].material.emissive.set(0x841e11);
			  		buoy.children[1].children[0].material.metalness=1;
			  		buoy.position.set(0,0,3);
					buoy.scale.set(0.1,0.1,0.1);

					createBBox(buoy);
					buoy1=buoy.clone();
					buoy2=buoy.clone();
					buoy3=buoy.clone();
					buoy4=buoy.clone();
					buoy5=buoy.clone();
				},undefined, function(error){console.error(error);});
	//fish
	loader.load("/models/level2/fish.glb", function(glb){fish = glb.scene.children[0].children[0].children[0].children[0].children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/fish.glb", function(glb){fish1 = glb.scene.children[0].children[0].children[0].children[0].children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/fish.glb", function(glb){fish2 = glb.scene.children[0].children[0].children[0].children[0].children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/fish.glb", function(glb){fish3 = glb.scene.children[0].children[0].children[0].children[0].children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/fish.glb", function(glb){fish4 = glb.scene.children[0].children[0].children[0].children[0].children[0];},undefined, function(error){console.error(error);});
	loader.load("/models/level2/fish.glb", function(glb){fish5 = glb.scene.children[0].children[0].children[0].children[0].children[0];},undefined, function(error){console.error(error);});
			  		
	//treasure
	loader.load("/models/level2/ghostShip.glb", 
		function(glb){
	  		treasure = glb.scene.children[0];
	  		treasure.name = 'treasure';
			treasure.position.set(95,-10,0)
			treasure.castShadow = true;
			
		}, 

		undefined, function(error){console.error(error);});
			

	//textures
	const textLoader = new THREE.TextureLoader(manager);

	AmbientOcclusion = textLoader.load("/texture/Water/AmbientOcclusion.jpg");
	BaseColor = textLoader.load("/texture/Water/BaseColor.jpg");
	Height = textLoader.load("/texture/Water/Height.png");
	Specular = textLoader.load("/texture/Water/Specular.jpg");
	Normal = textLoader.load("/texture/Water/Normal.jpg");

	PlanetAmbientOcclusion = textLoader.load("/texture/planet2/AmbientOcclusion.jpg");
	PlanetBaseColor = textLoader.load("/texture/planet2/BaseColor.jpg");
	PlanetHeight = textLoader.load("/texture/planet2/Height.png");
	PlanetNormal = textLoader.load("/texture/planet2/Normal.jpg");
	PlanetRoughness = textLoader.load("/texture/planet2/Roughness.jpg");

	crystalAmbientOcclusion = textLoader.load("/texture/crystalBall/AmbientOcclusion.jpg");
	crystalBaseColor = textLoader.load("/texture/crystalBall/BaseColor.jpg");
	crystalHeight = textLoader.load("/texture/crystalBall/Height.png");
	crystalNormal = textLoader.load("/texture/crystalBall/Normal.jpg");
	crystalRoughness = textLoader.load("/texture/crystalBall/Roughness.jpg");

	background = textLoader.load("/texture/outer space.jpg");

}


function init(){

	//initialize vocal interface clock
	clock = 0;
	talk();

	//set background
	world.scene.background = background;
	world.sceneTop.background = background;

	//scene adding
	positionSharks();
	positionLifesaver();
	positionBuoy();
	positionFish();

	crystal.children[0].material = new THREE.MeshStandardMaterial({
		color:0xfff000,
		side: THREE.DoubleSide,
		emissive: 0xffa000,
		emissiveIntensity:0.9,
		metalness: 1.0,
		map: crystalBaseColor,
		normalMap: crystalNormal,
		displacementMap: crystalHeight,
		displacementScale:0.1,
		displacementBias:0.5,
		roughnessMap: crystalRoughness,
		roughness: 1.0,
		aoMap: crystalAmbientOcclusion
		})
	UTIL.enlightPoint(crystal,4)

	world.scene.add(racoon.model);
	racoon.root.add(crystal)
	world.scene.add(treasure);

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
	racoon.position=waterGround;

	world.setPlanetMaterial(new THREE.MeshPhysicalMaterial({
		aoMap:PlanetAmbientOcclusion,
		bumpMap:PlanetHeight,
		// color: 0x2d1184,
		attenuationDistance: 0.4,
		reflectivity:0.0,
		side: THREE.DoubleSide,
		map: PlanetBaseColor,
		normalMap: PlanetNormal,
		emissive : 0x0000ff,
		specularIntensity: 0.4,
		specularColor: 0xff9b00,
		roughness: 1.0,
		roughnessMap:PlanetRoughness

	}));

	world.camera.lookAt(racoon.model.position);
	
	document.onkeydown = function(key){

		if(racoon.grab && clock==0){
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

			case 37: //left <-
						world.camera.position.x+=1*Math.PI/180
						break;
			case 39: //right ->
						world.camera.position.x-=1*Math.PI/180
						break;

			case 78: //N
				if(world.completed){location.replace("./main.html")}
				break;

			case 77: //M
				if(world.completed || racoon.dead){location.replace("./main.html")}
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
		probabilityClock+=0.5;

		if(racoon.pressed.includes(true) && world.sceneTop.getObjectByName( 'life1')!=undefined){

			if(racoon.canWalk==true && racoon.canJump==true){
				racoon.canWalk=false;
				racoon = ANIMATION.move(racoon,world);
				ANIMATION.swim(racoon);
				setTimeout(()=>{
					racoon=ANIMATION.whereAmI(racoon,waterGround,world);
					if(racoon.model.position.x>90 && clock==4){talk();}
					else if(racoon.model.position.x>91 && clock==5){talk();}
					else if(racoon.model.position.x>93 && clock==6){ANIMATION.leave(racoon,world,treasure)}
					else if(racoon.model.position.x>3 && clock==1){talk();}
					else if(racoon.model.position.x>18 && clock==2){talk();}
					else if(racoon.model.position.x>23 && clock==3){talk();}
					else if(racoon.position!=null && racoon.position!='void' && racoon.position.name.includes('lifesaver')){
						if(racoon.position.name.includes('bBox')){racoon.position=racoon.position.parent;}
						var next = teleports[Math.round(probabilityClock%6)];
						ANIMATION.teleport(racoon, next, world.camera);
					}
					else{racoon.canWalk=true;}
				},900)
			}
			else if(racoon.canWalk==true && racoon.canJump==false ){racoon = ANIMATION.move(racoon,world)}
		}
		else if(world.sceneTop.getObjectByName( 'life1')!=undefined && racoon.lostLife==false){
			racoon=ANIMATION.amIAttacked(racoon,objects,world);
			if(racoon.lostLife){setTimeout(()=>{racoon.lostLife=false;},1500)}
		}
	},100)
}

function positionLifesaver(){

	world.scene.add(lifesaver);
	lifesaver.name='lifesaver';
	lifesaver.position.set(25,0.2,-2);
	createBBox(lifesaver);
	teleports.push(lifesaver)

	lifesaver1.name='lifesaver';
	world.scene.add(lifesaver1)
	lifesaver1.position.set(43,0.2,10);
	createBBox(lifesaver1);
	teleports.push(lifesaver1)

	lifesaver2.name='lifesaver';
	world.scene.add(lifesaver2)
	lifesaver2.position.set(52,0.2,3);
	createBBox(lifesaver2);
	teleports.push(lifesaver2)

	lifesaver3.name='lifesaver';
	world.scene.add(lifesaver3)
	lifesaver3.position.set(62.5,0.2,-5);
	createBBox(lifesaver3);
	teleports.push(lifesaver3)

	lifesaver4.name='lifesaver';
	world.scene.add(lifesaver4)
	lifesaver4.position.set(82.5,0.2,-7);
	createBBox(lifesaver4);
	teleports.push(lifesaver4)

	lifesaver5.name='lifesaver';
	world.scene.add(lifesaver5)
	lifesaver5.position.set(89,0.2,2);
	createBBox(lifesaver5);
	teleports.push(lifesaver5)

	animateLifesavers();

}

function positionFish(){

	fish.scale.set(0.002,0.002,0.002);
	fish.position.set(5,0,-10);

	fish.name='fish';
	createBBox(fish);
	world.scene.add(fish);

	fish1.scale.set(0.002,0.002,0.002);
	fish1.position.set(10,0,10);
	fish1.name='fish';
	createBBox(fish1);
	fish1.rotation.y+=180*Math.pI/180;
	world.scene.add(fish1);

	fish2.scale.set(0.002,0.002,0.002);
	fish2.position.set(23,0,-10);
	fish2.name='fish';
	createBBox(fish2);
	world.scene.add(fish2);

	fish3.scale.set(0.002,0.002,0.002);
	fish3.position.set(30,0,10);
	fish3.name='fish';
	createBBox(fish3);
	fish3.rotation.y+=180*Math.pI/180;
	world.scene.add(fish3);

	fish4.scale.set(0.002,0.002,0.002);
	fish4.position.set(40,0,10);
	fish4.name='fish';
	createBBox(fish4);
	fish4.rotation.y+=180*Math.pI/180;
	world.scene.add(fish4);

	fish5.scale.set(0.002,0.002,0.002);
	fish5.position.set(50,0,-10);
	fish5.name='fish';
	createBBox(fish5);
	world.scene.add(fish5);

	objects.push(fish)
	objects.push(fish1)
	objects.push(fish2)
	objects.push(fish3)
	objects.push(fish4)
	objects.push(fish5)

	animateFish();
}

function positionBuoy(){

	world.scene.add(buoy);
	buoy.name='buoy';
	buoy.position.set(25,0,10);

	world.scene.add(buoy1);
	buoy1.name='buoy';
	buoy1.position.set(35,0,-5);

	world.scene.add(buoy2);
	buoy2.name='buoy';
	buoy2.position.set(55,0,10);

	world.scene.add(buoy3);
	buoy3.name='buoy';
	buoy3.position.set(75,0,5);

	world.scene.add(buoy4);
	buoy4.name='buoy';
	buoy4.position.set(77,0,-10);

	world.scene.add(buoy5);
	buoy5.name='buoy';
	buoy5.position.set(85,0,-5);

	animateBuoy();
}

function positionSharks(){
	
	world.scene.add(shark)
	shark.name='shark'
	shark.position.set(20,0,10);
	createBBox(shark);
	shark.rotation.z+=180*Math.PI/180;

	world.scene.add(shark1)
	shark1.name='shark'
	shark1.position.set(45,0,-10);
	createBBox(shark1);

	world.scene.add(shark2);
	shark2.name='shark';
	shark2.position.set(60,0,10);
	createBBox(shark2);
	shark2.rotation.z+=180*Math.PI/180;

	world.scene.add(shark3)
	shark3.name='shark'
	shark3.position.set(65,0,-10);
	createBBox(shark3);

	world.scene.add(shark4)
	shark4.name='shark'
	shark4.position.set(70,0,-10);
	createBBox(shark4);

	world.scene.add(shark5)
	shark5.name='shark'
	shark5.position.set(80,0,-10);
	createBBox(shark5);

	objects.push(shark)
	objects.push(shark1)
	objects.push(shark2)
	objects.push(shark3)
	objects.push(shark4)
	objects.push(shark5)

}

function animateBuoy(){
	createjs.Tween.get(buoy.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(buoy1.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(buoy2.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(buoy3.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(buoy4.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(buoy5.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);

	createjs.Tween.get(buoy.rotation,{loop:true}).to({ x: buoy.rotation.x+10*Math.PI/180},10000).to({ x: buoy.rotation.x-10*Math.PI/180},10000).to({x:buoy.rotation.x},10000);
	createjs.Tween.get(buoy1.rotation,{loop:true}).to({ x: buoy1.rotation.x+10*Math.PI/180},10000).to({ x: buoy1.rotation.x-10*Math.PI/180},10000).to({x:buoy1.rotation.x},10000);
	createjs.Tween.get(buoy2.rotation,{loop:true}).to({ x: buoy2.rotation.x+10*Math.PI/180},10000).to({ x: buoy2.rotation.x-10*Math.PI/180},10000).to({x:buoy2.rotation.x},10000);
	createjs.Tween.get(buoy3.rotation,{loop:true}).to({ x: buoy3.rotation.x+10*Math.PI/180},10000).to({ x: buoy3.rotation.x-10*Math.PI/180},10000).to({x:buoy3.rotation.x},10000);
	createjs.Tween.get(buoy4.rotation,{loop:true}).to({ x: buoy4.rotation.x+10*Math.PI/180},10000).to({ x: buoy4.rotation.x-10*Math.PI/180},10000).to({x:buoy4.rotation.x},10000);
	createjs.Tween.get(buoy5.rotation,{loop:true}).to({ x: buoy5.rotation.x+10*Math.PI/180},10000).to({ x: buoy5.rotation.x-10*Math.PI/180},10000).to({x:buoy5.rotation.x},10000);

	createjs.Tween.get(buoy.position,{loop:true}).to({ y: 0.2},10000).to({ y: 0},10000);
	createjs.Tween.get(buoy1.position,{loop:true}).to({ y: 0.2},10000).to({ y: 0},10000);
	createjs.Tween.get(buoy2.position,{loop:true}).to({ y: 0.2},10000).to({ y: 0},10000);
	createjs.Tween.get(buoy3.position,{loop:true}).to({ y: 0.2},10000).to({ y: 0},10000);
	createjs.Tween.get(buoy4.position,{loop:true}).to({ y: 0.2},10000).to({ y: 0},10000);
	createjs.Tween.get(buoy5.position,{loop:true}).to({ y: 0.2},10000).to({ y: 0},10000);
}

function animateLifesavers(){
	createjs.Tween.get(lifesaver.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(lifesaver1.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(lifesaver2.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(lifesaver3.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(lifesaver4.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
	createjs.Tween.get(lifesaver5.rotation,{loop:true}).to({ z: 360*Math.PI/180},30000);
}

function animateFish(){
	createjs.Tween.get(fish.position,{loop:true}).to({ z: 10},10000).to({z:-10},10000);
	createjs.Tween.get(fish1.position,{loop:true}).to({ z: -10},10000).to({z:10},10000);
	createjs.Tween.get(fish2.position,{loop:true}).to({ z: 10},10000).to({z:-10},10000);
	createjs.Tween.get(fish3.position,{loop:true}).to({ z: -10},10000).to({z:10},10000);
	createjs.Tween.get(fish4.position,{loop:true}).to({ z: -10},10000).to({z:10},10000);
	createjs.Tween.get(fish5.position,{loop:true}).to({ z: 10},10000).to({z:-10},10000);

	createjs.Tween.get(fish.rotation,{loop:true}).wait(10000).to({ y: fish.rotation.y+180*Math.PI/180},1).wait(10000).to({ y: fish.rotation.y+180*Math.PI/180},1);
	createjs.Tween.get(fish1.rotation,{loop:true}).wait(10000).to({ y: fish1.rotation.y+180*Math.PI/180},1).wait(10000).to({ y: fish1.rotation.y+180*Math.PI/180},1);
	createjs.Tween.get(fish2.rotation,{loop:true}).wait(10000).to({ y: fish2.rotation.y+180*Math.PI/180},1).wait(10000).to({ y: fish2.rotation.y+180*Math.PI/180},1);
	createjs.Tween.get(fish3.rotation,{loop:true}).wait(10000).to({ y: fish3.rotation.y+180*Math.PI/180},1).wait(10000).to({ y: fish3.rotation.y+180*Math.PI/180},1);
	createjs.Tween.get(fish4.rotation,{loop:true}).wait(10000).to({ y: fish4.rotation.y+180*Math.PI/180},1).wait(10000).to({ y: fish4.rotation.y+180*Math.PI/180},1);
	createjs.Tween.get(fish5.rotation,{loop:true}).wait(10000).to({ y: fish5.rotation.y+180*Math.PI/180},1).wait(10000).to({ y: fish5.rotation.y+180*Math.PI/180},1);

	createjs.Tween.get(shark.position,{loop:true}).to({ z: -10},10000).to({z:10},10000);
	createjs.Tween.get(shark1.position,{loop:true}).to({ z: 10},10000).to({z:-10},10000);
	createjs.Tween.get(shark2.position,{loop:true}).to({ z: -10},10000).to({z:10},10000);
	createjs.Tween.get(shark3.position,{loop:true}).to({ z: 10},10000).to({z:-10},10000);
	createjs.Tween.get(shark4.position,{loop:true}).to({ z: 10},10000).to({z:-10},10000);
	createjs.Tween.get(shark5.position,{loop:true}).to({ z: 10},10000).to({z:-10},10000);

	createjs.Tween.get(shark.position,{loop:true}).to({ y: 0.4},4000).wait(2000).to({y:0},4000);
	createjs.Tween.get(shark1.position,{loop:true}).to({ y: 0.4},4000).wait(2000).to({y:0},4000);
	createjs.Tween.get(shark2.position,{loop:true}).to({ y: 0.4},4000).wait(2000).to({y:0},4000);
	createjs.Tween.get(shark3.position,{loop:true}).to({ y: 0.4},4000).wait(2000).to({y:0},4000);
	createjs.Tween.get(shark4.position,{loop:true}).to({ y: 0.4},4000).wait(2000).to({y:0},4000);
	createjs.Tween.get(shark5.position,{loop:true}).to({ y: 0.4},4000).wait(2000).to({y:0},4000);

	createjs.Tween.get(shark.rotation,{loop:true}).wait(10000).to({ z: shark.rotation.z+180*Math.PI/180},1).wait(10000).to({ z: shark.rotation.z+180*Math.PI/180},1);
	createjs.Tween.get(shark1.rotation,{loop:true}).wait(10000).to({ z: shark1.rotation.z+180*Math.PI/180},1).wait(10000).to({ z: shark1.rotation.z+180*Math.PI/180},1);
	createjs.Tween.get(shark2.rotation,{loop:true}).wait(10000).to({ z: shark2.rotation.z+180*Math.PI/180},1).wait(10000).to({ z: shark.rotation.z+180*Math.PI/180},1);
	createjs.Tween.get(shark3.rotation,{loop:true}).wait(10000).to({ z: shark3.rotation.z+180*Math.PI/180},1).wait(10000).to({ z: shark3.rotation.z+180*Math.PI/180},1);
	createjs.Tween.get(shark4.rotation,{loop:true}).wait(10000).to({ z: shark4.rotation.z+180*Math.PI/180},1).wait(10000).to({ z: shark4.rotation.z+180*Math.PI/180},1);
	createjs.Tween.get(shark5.rotation,{loop:true}).wait(10000).to({ z: shark5.rotation.z+180*Math.PI/180},1).wait(10000).to({ z: shark5.rotation.z+180*Math.PI/180},1);
	
}


function skeletonPositioning(){
	racoon.root.position.x = 0 ;
	racoon.root.position.y = -0.55 ;
	racoon.root.position.z = 0 ;
	racoon.root.rotation.y = 90*Math.PI/180;
	racoon.upperSpine.rotation.x -=10*Math.PI/180;
	racoon.lowerSpine.rotation.x -=10*Math.PI/180;
			  		
	racoon.rightShoulder.rotation.x -=50*Math.PI/180
	racoon.rightArm.rotation.x +=20*Math.PI/180
		  		
	racoon.leftShoulder.rotation.x -=50*Math.PI/180
	racoon.leftArm.rotation.x +=20*Math.PI/180


}

function createBBox(object){

	var bBox = new THREE.Box3().setFromObject(object, true);
	
	var geometry = new THREE.BoxGeometry(bBox.max.x-bBox.min.x,bBox.max.y-bBox.min.y,bBox.max.z-bBox.min.z);

	var bx = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({side: THREE.DoubleSide, wireframe:true,color:0x0000ff}));
	if(object.name=='buoy'){
		bx.scale.set(10,10,9)
		bx.rotation.x = -90*Math.PI/180

		var clone=bx.clone()
		clone.rotation.y = -90*Math.PI/180;
		clone.name = 'bBox'+object.name;
		object.add(clone)
	}
	else if(object.name=='fish'){
		bx.scale.set(1000,2000,200)
		bx.position.x=-15
		bx.position.y=100

		var clone=bx.clone()
		clone.rotation.y = -90*Math.PI/180;
		clone.name = 'bBox'+object.name;
		object.add(clone)
	}

	else if(object.name=='shark'){
		bx.scale.set(1,2.5,0.4)
		bx.position.set(-0,0.5,-0.3)

		var clone=bx.clone()
		clone.rotation.y = -90*Math.PI/180;
		clone.name = 'bBox'+object.name;
		object.add(clone)
	}

	else if(object.name=='lifesaver'){
		bx.scale.set(10,26,7)
		bx.position.z-=0.5

		var clone=bx.clone()
		clone.rotation.y = -90*Math.PI/180;
		clone.name = 'bBox'+object.name;
		object.add(clone)
	}


	bx.rotation.y = 90*Math.PI/180;
	bx.name = 'bBox'+object.name;
	object.add(bx);

	bx.visible=false;
	clone.visible=false;
	return bx

}



function talk(){
	switch(clock){
		case 0:
			document.getElementById('ins').innerHTML = "Hello there, that's Oswin talking. Today i will follow you directly into the mission. Can you see the treasure you've stolen during the training? I'm in there, I've told you it would became useful in the future. Unfortunately today we have to swim to reach our treasure, let's just go ahead for the moment!";
			break;

		case 1:
			document.getElementById('ins').innerHTML = "Pay attention, fishes can eat us and buoy can make us drown!";
			break;

		case 2:
			document.getElementById('ins').innerHTML = "You don't really wanna know what sharks can do to us, right? Just avoid them!";
			break;

		case 3:
			document.getElementById('ins').innerHTML = "Before landing I've checked for teleport, they exist but are quite defective so there is a big chance that we will teleport us in the wrong place. If you'd like to challenge Fortuna go reach a lifesaver at your risk!";
			break;

		case 4:
			document.getElementById('ins').innerHTML = "It's here, it should be here!";
			ANIMATION.raise(treasure);
			break;

		case 5:
			document.getElementById('ins').innerHTML = "Here it is. Ain't it beautiful? Move towards the aperture to go on board!";
			break;
	}
	clock+=1;
}

function createGround(scene){

	const geometry1 = new THREE.BoxGeometry(100,30,0.5,500,500);

	const materialWater = new THREE.MeshPhysicalMaterial({
		color: 0xa2befe,
		side: THREE.DoubleSide,
		map: BaseColor,
		normalMap: Normal,
		bumpMap: Height,
		aoMap: AmbientOcclusion,
		attenuationDistance: 0.4,
		
		emissive : 0x0000ff,
		specularColorMap:Specular,
		specularIntensity: 0.4,
		specularColor: 0x0000ff,
		opacity:0.5,
		transparent:true
	});

	const materialWaterLayers = new THREE.MeshPhysicalMaterial({
		color: 0x00ffff,
		side: THREE.DoubleSide,
		map: BaseColor,
		normalMap: Normal,
		bumpMap: Height,
		aoMap: AmbientOcclusion,
		attenuationDistance: 0.4,
		
		emissive : 0x00000f,
		specularColorMap:Specular,
		specularIntensity: 0.4,
		specularColor: 0x0000ff
	});

	waterGround = new THREE.Mesh(geometry1, materialWater);
	var layer1 = new THREE.Mesh(geometry1, materialWater);
	var layer2 = new THREE.Mesh(geometry1, materialWaterLayers);

	waterGround.name='ground';
	waterGround.rotation.x = 90 * Math.PI/180;
	waterGround.position.set(49,0.05,0);

	layer1.name='layer1'
	layer1.rotation.x = 90 * Math.PI/180;
	layer1.rotation.y = -180 * Math.PI/180;
	layer1.position.set(49,-0.15,0);
	layer1.material.bumpMap.flipY = false;

	layer2.name='layer2'
	layer2.rotation.x = 90 * Math.PI/180;
	layer2.rotation.y = 180 * Math.PI/180;
	layer2.position.set(49,-0.6,0);
	
	scene.add(waterGround);
	scene.add(layer1);
	scene.add(layer2);
}

