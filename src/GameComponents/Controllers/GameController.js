import {
    Color3,
    Color4, FreeCamera,
    HemisphericLight,
    Matrix,
    Mesh,
    MeshBuilder, PointLight,
    Quaternion, Scene, ShadowGenerator,
    StandardMaterial, UniversalCamera,
    Vector3
} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import GameObject from "./GameObject";
import EnvironmentController from "./EnvironnementController";
import InputController from "./InputController";
import PlayerController from "./PlayerController";
import PlayerCreator from "./PlayerCreator";

class GameController {

    constructor(scene,engine) {
        // Initialization
        GameObject.GameController = this;
        GameObject.Scene = scene;
        this.engine= engine
        this.setUpGame(scene)
    }
    setUpGame(scene){
        const environment= new EnvironmentController(scene)
        this.environment= environment;
        this.environment.load()
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        light0.intensity=0.5;
        this.player = new PlayerCreator();
        this.player.loadCharacterAssets()
        this.input= new InputController();
        this.player.controller= new PlayerController(this.input,this.player.mesh);
        this.player.controller.activatePlayerCamera();
    }
}



export default GameController;
