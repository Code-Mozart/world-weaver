use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

mod avl_tree;

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Line {
    from_x: f32,
    from_y: f32,
    to_x: f32,
    to_y: f32,
}
