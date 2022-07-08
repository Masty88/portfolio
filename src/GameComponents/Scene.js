import React from "react";
import SceneComponent from "./SceneComponent";
import GameController from "./Controllers/GameController";


const StartScene= () => {

    const onSceneReady =async  (scene,engine) => {
        let game = new GameController(scene, engine);
    };

    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </div>
    )

};

export default StartScene;
