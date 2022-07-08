import {Engine, Scene, Vector3} from "@babylonjs/core";
import React, { useEffect, useRef } from "react";



export default (props) => {
    const reactCanvas = useRef(null);
    const { antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;

    useEffect(() => {
        if (reactCanvas.current) {
            const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
            let scene = new Scene(engine, sceneOptions);
            if (scene.isReady()) {
                props.onSceneReady(scene, engine);
            } else {
                scene.onReadyObservable.addOnce((scene) => props.onSceneReady(scene));
            }
            //STATE MACHINE
            engine.runRenderLoop(() => {
                scene.render()
            });
            const resize = () => {
                scene.getEngine().resize();
            };
            if (window) {
                window.addEventListener("resize", resize);
            }
            return () => {
                scene.getEngine().dispose();
                if (window) {
                    window.removeEventListener("resize", resize);
                }
            };
            // main();
        }
    }, [reactCanvas]);
    return <canvas ref={reactCanvas} {...rest} />;
};
