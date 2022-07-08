import GameObject from "./GameObject";


import {
    ArcRotateCamera, Color3,
    Color4,
    FreeCamera,
    Matrix, Mesh,
    MeshBuilder,
    Quaternion, Ray,
    StandardMaterial, TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";




class PlayerController extends GameObject{

    static PLAYER_SPEED= 0.45;
    static GRAVITY = -2.8;
    static JUMP_FORCE = 0.8;
    static DASH_FACTOR= 2.5;
    static DASH_TIME = 10;

    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position

    constructor(input,player) {
        super();
        this.setupPlayerCamera();
        this.isJumping = false;
        this.player= player
        this.input = input;
    }

    updateFromControl(){
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        this.moveDirection = Vector3.Zero(); // vector that holds movement information
        this.h = this.input.horizontal; //x-axis
        this.v = this.input.vertical; //z-axis

        //Movement based on Camera
        let fwd = this._camRoot.forward;
        let right = this._camRoot.right;
        let correctedVertical = fwd.scaleInPlace(this.v);
        let correctedHorizontal = right.scaleInPlace(this.h);
        //movement based off of camera's view
        let move = correctedHorizontal.addInPlace(correctedVertical);

        this.moveDirection = new Vector3(move.normalize().x, 0, move.normalize().z);


        //clamp the input value so that diagonal movement isn't twice as fast
        let inputMag = Math.abs(this.h) + Math.abs(this.v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 1) {
            this._inputAmt = 1;
        } else {
            this._inputAmt = inputMag;
        }

        //final movement that takes into consideration the inputs
        this.moveDirection = this.moveDirection.scaleInPlace(this._inputAmt * PlayerController.PLAYER_SPEED);


        //Rotations
        //check if there is movement to determine if rotation is needed
        let input = new Vector3(this.input.horizontalAxis, 0, this.input.verticalAxis); //along which axis is the direction
        if (input.length() === 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }
        //rotation based on input & the camera angle
        let angle = Math.atan2(this.input.horizontalAxis, this.input.verticalAxis);
        angle += this._camRoot.rotation.y;
        let targ = Quaternion.FromEulerAngles(0, angle, 0);
        this.player.rotationQuaternion = Quaternion.Slerp(this.player.rotationQuaternion, targ, 10 * this.deltaTime);
    }

    floorRayCast(offsetx, offsetz, raycastlen){
        let raycastFloorPos = new Vector3(this.player.position.x + offsetx, this.player.position.y +0.1, this.player.position.z + offsetz);
        let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);
        let predicate = function (mesh) {
            return mesh.isPickable && mesh.isEnabled();
        }
        let pick = this.scene.pickWithRay(ray, predicate);
        if (pick.hit) {
            return pick.pickedPoint;
        } else {
            return Vector3.Zero();
        }
    }

    isGrounded(){
        if(this.floorRayCast(0,0,0.6).equals(Vector3.Zero())){
            return false
        }else{
            return true;
        }
    }

    updateGroundDetection(){
        if(!this.isGrounded()){
            this.gravity= this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * PlayerController.GRAVITY));
            this.grounded = false;
        }
        if (this.gravity.y < -PlayerController.JUMP_FORCE) {
            this.gravity.y = -PlayerController.JUMP_FORCE;
        }

        this.player.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));

        if (this.isGrounded()) {
            this.gravity.y = 0;
            this.grounded = true;
            this.lastGroundPos.copyFrom(this.player.position);
            this.jumpCount = 1;
            this.isJumping=false
        }

        //Jump detection
        if(this.input.jumpKeyDown && this.jumpCount > 0) {
            this.gravity.y = PlayerController.JUMP_FORCE;
            this.jumpCount--;
            this.isJumping= true;
        }
    }

    beforeRenderUpdate(){
        this.updateFromControl()
        this.updateGroundDetection()
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
            this.updateCamera()
        }

        return this.camera;
    }

    updateCamera(){
        let centerPlayer = this.player.position.y + 2;
        this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(this.player.position.x, centerPlayer, this.player.position.z), 0.4);
    }

    setupPlayerCamera() {

        //root camera parent that handles positioning of the camera to follow the player
        this._camRoot = new TransformNode("root");
        this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
        //to face the player from behind (180 degrees)
        this._camRoot.rotation = new Vector3(0, Math.PI, 0);

        //rotations along the x-axis (up/down tilting)
        let yTilt = new TransformNode("ytilt");
        //adjustments to camera view to point down at our player
        yTilt.rotation = new Vector3(0.5934119456780721, 0, 0);
        this._yTilt = yTilt;
        yTilt.parent = this._camRoot;

        //our actual camera that's pointing at our root's position
        this.camera = new UniversalCamera("cam", new Vector3(0, 0, -30), this.scene);
        this.camera.lockedTarget = this._camRoot.position;
        this.camera.fov = 0.47350045992678597;
        this.camera.parent = yTilt;

        this.scene.activeCamera = this.camera;
        return this.camera;
    }

}

export default PlayerController;
