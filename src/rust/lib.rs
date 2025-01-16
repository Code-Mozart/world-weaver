use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Tsify, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Foo {
    a: i32,
    b: String,
    c: Vec<i32>,
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn take_foo(foo: Foo) {
    alert(&format!("Received foo, a={:?}, b={:?}, c={:?}!", foo.a, foo.b, foo.c));
}
