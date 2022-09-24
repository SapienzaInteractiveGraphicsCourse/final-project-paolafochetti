import * as THREE from '../three.js-master/build/three.module.js';
import {SphereGeometry} from '../three.js-master/src/geometries/SphereGeometry.js';
import {animatePlanet} from './animation.js';

export class World{
	constructor(){
		this._initialize();
	}

	_initialize(){

		//load textures for planet
		this.planetTextures();
		
		//renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setScissorTest( true );
		
		this.completed = true;

		document.getElementById('container').appendChild(this.renderer.domElement); //add the renderer to the html
		
		//scene
		this.sceneTop = new THREE.Scene();
		this.sceneTop.name='sceneTop';
		this.scene = new THREE.Scene();
		this.scene.name='scene';

		//camera
		this.createCamera();		

		//light
		this.createLight();

		//planet
		this.createPlanet();	





		this.animate();
	}

	createLight(){
		this.light=new THREE.AmbientLight(0xffffff, 2.5);
		this.light.position.set(0,3,2);
		this.scene.add(this.light);
		this.sceneTop.add(this.light.clone());

	}
	createCamera(){
		this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.0001, 4000);

		this.cameraTop = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.0001, 4000);
		this.cameraTop.position.set(-4, 1, 0);
		this.cameraTop.rotation.y = 270*Math.PI/180

		this.camera.frustumCulled=false;
		this.camera.position.set(-1.5, 1, 0);
		this.camera.rotation.y = 270*Math.PI/180
		this.renderer.render(this.scene,this.camera);

	}



	createPlanet(){
		var geometry = new SphereGeometry(20,1000,1000);
		var material = new THREE.MeshStandardMaterial( {color: 0x000000} );

 		this.planet = new THREE.Mesh( geometry, material );
		this.planet.position.set(30, 5, -40);
		this.scene.add(this.planet);
		animatePlanet(this.planet);
	}

	setPlanetMaterial(material){
		this.planet.material = material;
	}
	animate(){

		requestAnimationFrame(()=>{

			this.renderer.setScissor( 0, window.innerHeight-30, window.innerWidth, window.innerHeight);
			this.renderer.clear()
			this.renderer.render(this.sceneTop,this.cameraTop)

			this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight-30);
			this.renderer.clear()
			this.renderer.render(this.scene,this.camera);

			this.animate();
		})
	}

	planetTextures(){
	const textLoader = new THREE.TextureLoader();
	
	this.PlanetAmbientOcclusion = textLoader.load("/texture/planet/planet1/AmbientOcclusion.jpg");
	this.PlanetBaseColor = textLoader.load("/texture/planet/planet1/BaseColor.jpg");
	this.PlanetHeight = textLoader.load("/texture/planet/planet1/Height.png");
	this.PlanetNormal = textLoader.load("/texture/planet/planet1/Normal.jpg");
	this.PlanetRoughness = textLoader.load("/texture/planet/planet1/Roughness.jpg");

}

	reset(){
		while(this.scene.children.length > 0){ 
    		this.scene.remove(this.scene.children[0]);}
    	while(this.sceneTop.children.length > 0){ 
    		this.sceneTop.remove(this.sceneTop.children[0]);}
		this.createCamera();
		this.createLight();
		this.createPlanet();

	}

}

