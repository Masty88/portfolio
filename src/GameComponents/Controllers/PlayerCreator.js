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

class PlayerCreator extends GameObject{
    constructor() {
        super();
        // this.loadCharacterAssets()
    }

    loadCharacterAssets(shadowGenerator){
        console.log("load")
        this.mesh = MeshBuilder.CreateBox("outer", {width: 2, depth: 1, height: 3});
        this.mesh.isVisible = false;
        this.mesh.isPickable = false;
        this.mesh.checkCollisions = true;

        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 0, 0))

        //for collisions
        this.mesh.ellipsoid = new Vector3(1, 1.5, 1);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);

        this.mesh.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
        this.mesh.position.y= 10;

        const box = MeshBuilder.CreateBox("Small1", {
            width: 0.5,
            depth: 0.5,
            height: 0.25,
            faceColors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)]
        });
        box.position.y = 0.5;
        box.position.z = 1;

        const body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0);
        const bodymtl = new StandardMaterial("red", this.scene);
        bodymtl.diffuseColor = new Color3.Red();
        body.material = bodymtl;
        body.isPickable = false;
        body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

        //parent the meshes
        box.parent = body;
        body.parent = this.mesh;

        return null;
    }
}

export default PlayerCreator
