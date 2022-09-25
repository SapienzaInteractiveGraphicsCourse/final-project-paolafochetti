import * as THREE from './three.js-master/build/three.module.js';
import * as GLTF from './three.js-master/loaders/GLTFLoader.js';
import * as LOADER from './three.js-master/src/loaders/LoadingManager.js';
import * as UTIL from './common/utilities.js';
import * as ANIMATION from './common/animation.js';
import {Racoon} from './common/player.js';
import {World} from './common/world.js';


var racoon;
var interfaceTalking=true;
var spaceShip;
var buttons=true;
var treasure;

var objects=[];


var AmbientOcclusion,BaseColor,Height,Normal,Roughness;
var PlanetAmbientOcclusion,PlanetBaseColor,PlanetHeight,PlanetMaterial,PlanetNormal,PlanetRoughness;
var treasureAmbientOcclusion, treasureBaseColor, treasureHeight, treasureNormal, treasureSpecular, treasureRoughness;
var background;


var pressed=[false, false, false, false]//[W,D,A,S]


var lifeModel1, lifeModel2, lifeModel3;
var world = new World(); 
var ground1, ground2;


var clock;

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
	loader.load("./models/racoon.glb", 
				function(glb){
			  		racoon = new Racoon(glb.scene.children[0]);
			  		racoon.level=0;
			  		racoon.root.position.x = 0 ;
			  		racoon.root.position.y = -0.37 ;
			  		racoon.root.position.z = 0 ;
			  		racoon.root.rotation.y = 90*Math.PI/180;
			  		racoon.model.position.set(0,  0.35, 0);
			  		racoon.checkPoint = racoon.model.position.clone();});

	// life
	loader.load("./models/heart/scene.gltf", 
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
	
	//spaceShip
	loader.load("./models/training/spaceship.glb", 
				function(glb){
			  		spaceShip = glb.scene.children[0];
			  		spaceShip.name='spaceShip';
			  		spaceShip.visible=false;
			  		spaceShip.scale.set(0.2,0.2,0.2);
				},undefined, function(error){console.error(error);});
	
	//treasure
	loader.load("./models/training/crystalBall.glb", 
				function(glb){
			  		treasure = glb.scene.children[0].children[0];
			  		treasure.name='treasure';
			  		treasure.visible=true;
			  		treasure=UTIL.enlightPoint(treasure)
			  		UTIL.enlight(treasure, 10)
			  		treasure.position.set(9,0.3,3)
			  		treasure.scale.set(0.1,0.1,0.1);
			  		
				},undefined, function(error){console.error(error);});

	const textLoader = new THREE.TextureLoader(manager);

	AmbientOcclusion = textLoader.load("./texture/training/AmbientOcclusion.jpg");
	BaseColor = textLoader.load("./texture/training/BaseColor.jpg");
	Height = textLoader.load("./texture/training/Height.png");
	Normal = textLoader.load("./texture/training/Normal.jpg");
	Roughness = textLoader.load("./texture/training/Roughness.jpg");

	treasureAmbientOcclusion = textLoader.load("./texture/crystalBall/AmbientOcclusion.jpg");
	treasureBaseColor = textLoader.load("./texture/crystalBall/BaseColor.jpg");
	treasureHeight = textLoader.load("./texture/crystalBall/Height.png");
	treasureNormal = textLoader.load("./texture/crystalBall/Normal.jpg");
	treasureRoughness = textLoader.load("./texture/crystalBall/Roughness.jpg");

	PlanetAmbientOcclusion = textLoader.load("./texture/planet0/AmbientOcclusion.jpg");
	PlanetBaseColor = textLoader.load("./texture/planet0/Basecolor.jpg");
	PlanetHeight = textLoader.load("./texture/planet0/Height.png");
	PlanetNormal = textLoader.load("./texture/planet0/Normal.jpg");
	PlanetRoughness = textLoader.load("./texture/planet0/Roughness.jpg");

	background = textLoader.load("./texture/background.png");

}

function setTextures(){
	treasure.children[0].material= new THREE.MeshStandardMaterial({
		color:0xfff000,
		side: THREE.DoubleSide,
		emissive: 0xffa000,
		emissiveIntensity:0.9,
		metalness: 1.0,
		map: treasureBaseColor,
		normalMap: treasureNormal,
		displacementMap: treasureHeight,
		displacementScale:0.1,
		displacementBias:0.5,
		roughnessMap: treasureRoughness,
		roughness: 1.0,
		aoMap: treasureAmbientOcclusion
		})
}
function init(){

	setTextures();
	clock=0;
	talk();

	world.scene.background = background;
	world.sceneTop.background = background;

	world.scene.add(racoon.model);
	world.scene.add(treasure)

	world.sceneTop.add(lifeModel1);
	world.sceneTop.add(lifeModel2);
	world.sceneTop.add(lifeModel3);
	
	lifeModel1.position.set(0,5.5,-10)
	lifeModel2.position.set(0,5.5,-9.5)
	lifeModel3.position.set(0,5.5,-9)

	lifeModel1.rotation.y=90*Math.PI/180;
	lifeModel2.rotation.y=90*Math.PI/180;
	lifeModel3.rotation.y=90*Math.PI/180;

	createGround(world.scene);
	racoon.position=ground1;

	world.scene.add(spaceShip);
	spaceShip.position.set(13,0,0);

	createBBox(spaceShip);
	createBBox(treasure);

	world.setPlanetMaterial(new THREE.MeshPhysicalMaterial({
		aoMap:PlanetAmbientOcclusion,
		bumpMap:PlanetHeight,
		color: 0x118428,
		attenuationDistance: 0.4,
		reflectivity:0.0,
		side: THREE.DoubleSide,
		map: PlanetBaseColor,
		normalMap: PlanetNormal,
		specularIntensity: 0.4,
		specularColor: 0xff9b00,
		roughness: 1.0,
		roughnessMap:PlanetRoughness

	}));

	setTimeout(()=>{talk()},2000);
	
	document.onkeydown = function(key){
		if(!buttons){
			return;
		}
		else if(buttons){
		
			if (interfaceTalking){racoon.canWalk=false;}
			else{racoon.canWalk=true;}
			if(racoon.grab){
				racoon.canWalk=false;
				talk();
			}
				
			switch (key.keyCode){
		
				case 87: //W
					racoon.pressed[0]=true;
					if(clock==2){talk();}
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
					
				case 71: //G
					if (racoon.grab==true){
						ANIMATION.grabTreasure(racoon);
						racoon.stolen=true;
						setTimeout(()=>{
							ANIMATION.treasureAnimation(treasure, world, racoon.level);
							talk();
							},800);
						}
						break;
					case 32: //spacebar
						if (racoon.canJump && clock>3){
							racoon.startingJump = racoon.model.position.clone()
							racoon.canJump=false;
							ANIMATION.jump(racoon,2,world,objects);}
						setTimeout(()=>{
							racoon.canWalk=true;
							racoon.canJump=true;},2000)
		
						break;

					case 37: //left <-
						world.camera.position.x+=1*Math.PI/180
						break;
					case 39: //right ->
						world.camera.position.x-=1*Math.PI/180
						break;

					case 78: //N
						if(world.completed){location.replace("./level1.html")}
						break;

					case 77: //M
						if(world.completed || racoon.dead){location.replace("./index.html")}
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
			}}
	var interval = window.setInterval(function(){
		if(world.sceneTop.getObjectByName( 'life3')==undefined && clock==4){talk();}
		if(racoon.grab){racoon.canWalk=false;}
		if(racoon.model.position.x>8 && racoon.model.position.x<9.5 && racoon.model.position.z>2.5 && racoon.model.position.z<4 &&racoon.stolen==false){racoon.canWalk=false;racoon.grab=true;}
		else if(racoon.pressed.includes(true) && world.sceneTop.getObjectByName( 'life1')!=undefined){
			if(racoon.model.position.x>4.30 && clock==3){
				if(racoon.model.position.x<4.50){talk();}
			}
			else if(racoon.canWalk==true && racoon.canJump==true){
				
				racoon.canWalk=false;
				ANIMATION.move(racoon,world)
				ANIMATION.moveLegs(racoon);
				setTimeout(()=>{
					buttons=false;
					racoon=ANIMATION.whereAmI(racoon,objects,world);
					if(racoon.lostLife){setTimeout(()=>{buttons=true;racoon.canWalk=true; racoon.lostLife=false;},1500)}
					else{buttons=true;racoon.canWalk=true;}
					
					if(racoon.position.name=='ground2' && clock==5){talk();}
				},300)
			}
			else if(racoon.canWalk==true && racoon.canJump==false ){ANIMATION.move(racoon,world)}
		}
	},310)
}


function talk(){
	racoon.canWalk=false;
	buttons=false;
	switch(clock){

		case 0:
			document.getElementById('ins').innerHTML="Hello there, that's Oswin talking.\nI'm the vocal interface of your ship and your best friend, Captain."
			break;

		case 1:
			document.getElementById('ins').innerHTML = "I will guide you in this training session and show you some trick that you may have forget Captain.\nFirst press W to move forward, you can move in any other direction with A, S and D.";
			break;

		case 2:
			document.getElementById('ins').innerHTML = "You can move the camera forward or backward, press the right and left arrow to explore.";
			break;

		case 3:
			racoon.checkPoint=racoon.model.position.clone();
			document.getElementById('ins').innerHTML = "Now, you can see by yourself that the ground is interrumpted. Try walk ahead a little more.";
			break;

		case 4:
			document.getElementById('ins').innerHTML = "Ooops... you may have lost a life. You have three life available, once they are ended you are ended. Now, let's get over this by jumping. Press spacebar and W together to jump while moving forward.";
			break;

		case 5:
			document.getElementById('ins').innerHTML = "That was beatiful! Now, on your right there is an object. A blue light will always identify your target. Go grab it.";
			break;

		case 6:
			document.getElementById('ins').innerHTML = "Now press 'G' to grab the treasure.";
			break;
	
		case 7:
			document.getElementById('ins').innerHTML = "Treasure collected, this will come in handy in the future. You can see all you grab in the upper right corner. Now you're ready. I've landed at the end of the field. Reach the spaceship so we can go on an adventure.";
			spaceShip.visible=true;
			break;
	}
	setTimeout(()=>{racoon.canWalk=true;
				interfaceTalking=false;
				buttons=true;},1500)
	
	clock+=1;

}

function createBBox(object){

	var bBox = new THREE.Box3().setFromObject(object, true);
	
	var geometry = new THREE.BoxGeometry(bBox.max.x-bBox.min.x,bBox.max.y-bBox.min.y,bBox.max.z-bBox.min.z);

	var bx = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({side: THREE.DoubleSide, wireframe:true,color:0x0000ff}));


	if(object.name=='spaceShip'){
		var clone=bx.clone()

		bx.scale.set(3,4,10);
		bx.position.z=2

		clone.name = 'bBox'+object.name;
		clone.rotation.y = 180*Math.PI/180;
		clone.position.z=2
		clone.visible = false;
		object.add(clone);
	}

	if(object.name=='treasure'){
		bx.scale.set(16,23,16);
		
		var clone=bx.clone()
		clone.name = 'bBox'+object.name;
		clone.rotation.y = 180*Math.PI/180;
		clone.visible = false;
		object.add(clone);
	}

	bx.rotation.y = 90*Math.PI/180;
	bx.name = 'bBox'+object.name;
	object.add(bx);
	bx.visible=false;

	return bx

}


function createGround(scene){
	const geometry3 = new THREE.PlaneGeometry(10,10,100,100);

	const material = new THREE.MeshStandardMaterial({
		color: 0xaaafff,
		side: THREE.DoubleSide,
		map: BaseColor,
		normalMap: Normal,
		displacementMap: Height,
		displacementScale:0.2,
		metalness:0,
		roughnessMap:Roughness,
		roughness: 1.0,
		aoMap: AmbientOcclusion

	});
	ground1 = new THREE.Mesh(geometry3, material);
	ground2 = new THREE.Mesh(geometry3, material);

	ground1.name='ground1'
	ground1.rotation.x = 90 * Math.PI/180;
	ground1.position.set(0,0,0);

	ground2.name='ground2'
	ground2.rotation.x = 90 * Math.PI/180;
	ground2.position.set(11,0,0);
	
	scene.add(ground1);
	scene.add(ground2);

	objects.push(ground1);
	objects.push(ground2);
	
}

