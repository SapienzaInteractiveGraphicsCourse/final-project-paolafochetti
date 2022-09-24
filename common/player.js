import * as GLTF from 'gltf';
import * as THREE from '../three.js-master/build/three.module.js'
export class Racoon{

	constructor(model){
		this.model=model;
		this.setFrustum(this.model)
		this.skinnedMesh = model.children[1];
		this.position;
		this.startingJump;
		this.grab = false;
		this.direction = new THREE.Vector3(0,this.model.position.y,0);
		this.previousDirection;
		this.bones = this.extractBones(this.skinnedMesh);
		this.bBox;
		this.canWalk=true;
		this.canJump=true;
		
		this.skinnedMesh.add(this.root)
		this.skinnedMesh.bind(this.skeleton)

		this.life = 3;
		this.dead=false;
		this.lostLife=false;
		this.stolen = false;
		this.checkpoint;
		this.pressed = [false, false, false, false] //W D A S
		this.level=0;
	}

	setFrustum(model){
		model.children[0].traverse(function(child){
			if(child.type == 'Object3D'){child.frustumCulled=false}})
	}
	
	loseLife(){
		this.life-=1;
	}

	recoverPosition(checkpoint){
		
		this.model.position.x=checkpoint.x;
		this.model.position.y=checkpoint.y;
		this.model.position.z=checkpoint.z;
		this.root.rotation.y=90*Math.PI/180;
	}
	setPosition(x, y, z){
		this.model.position.set(this.root.position);

	}

	rotate(x, y, z){
		if(x!=null){this.model.rotation.x= x*Math.PI/180};
		if(y!=null){this.model.rotation.y= y*Math.PI/180};
		if(z!=null){this.model.rotation.z= z*Math.PI/180};
	}

	extractBones(mesh){
		const bones = [];

		mesh.parent.traverse(function(child){
			if(child.type == 'Bone'){bones.push(child)}})
		
		this.skeleton = new THREE.Skeleton(bones);
		this.assignBone(this.skeleton);
	}

	assignBone(skeleton){
		this.root = skeleton.getBoneByName('Root');

		this.lowerSpine = skeleton.getBoneByName('lowerSpine');
		this.upperSpine = skeleton.getBoneByName('upperSpine')
		this.head = skeleton.getBoneByName('head')


		this.rightThigh = skeleton.getBoneByName('rightThigh')
		this.rightLeg = skeleton.getBoneByName('rightLeg')
		this.rightFoot = skeleton.getBoneByName('rightFoot')
					
		this.leftShoulder = skeleton.getBoneByName('leftShoulder')

		this.leftArm = skeleton.getBoneByName('leftArm')
		this.leftElbow = skeleton.getBoneByName('leftElbow')
		this.leftArm = skeleton.getBoneByName('leftArm')
		this.leftHand = skeleton.getBoneByName('leftHand')

		this.leftThigh = skeleton.getBoneByName('leftThigh')
		this.leftLeg = skeleton.getBoneByName('leftLeg')
		this.leftFoot = skeleton.getBoneByName('leftFoot')

		this.rightShoulder = skeleton.getBoneByName('rightShoulder')

		this.rightArm = skeleton.getBoneByName('rightArm')
		this.rightElbow = skeleton.getBoneByName('rightElbow')
		this.rightArm = skeleton.getBoneByName('rightArm')
		this.rightHand = skeleton.getBoneByName('rightHand')


		this.lowerTail = skeleton.getBoneByName('lowerTail')
		this.upperTail = skeleton.getBoneByName('upperTail')
	}
}