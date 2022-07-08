import GameObject from "./GameObject";
import {MeshBuilder, Scene, SceneLoader, Vector3} from "@babylonjs/core";


class EnvironmentController extends GameObject{
    constructor() {
        super();
    }
    async load(){
        let ground = MeshBuilder.CreateBox("ground", {size:44}, this.scene)
        ground.scaling = new Vector3(1,.01,1);
        ground.receiveShadows= true;
    }
}

export default EnvironmentController;
