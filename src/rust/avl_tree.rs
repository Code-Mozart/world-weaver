use std::ops::Index;

struct Node<T: Ord> {
    value: Option<T>,
    height: u8,
}

/// A generic AVL tree (which is one way to implement a self-balancing binary
/// search tree) that uses a dynamic array (`Vec`) for storing the data. The type
/// argument must implement `Ord`, i.e. a comparator so that the tree is able to
/// sort itself.
///
/// Even though we use a dynamic array under the hood this tree, like a _set_ does
/// **not** allow duplicate values, that is two values may never have the same ordering,
/// see [`Self::insert()`].
///
/// You can read more about AVL trees here: https://en.wikipedia.org/wiki/AVL_tree.
pub struct AvlTree<T: Ord> {
    data: Vec<Node<T>>,
}

impl<T: Ord> AvlTree<T> {
    /// Creates a new, empty AVL tree.
    pub fn new() -> Self {
        AvlTree { data: Vec::new() }
    }

    /// Inserts the value into the tree.
    /// Insertions cause the tree to rebalance and sort itself.
    pub fn insert(&self, value: T) {
        let index = self.find_insert_index(&value);
    }

    fn find_insert_index(&self, value: &T) -> Option<usize> {
        let mut index: usize = 0;
        loop {
            // Use unwrap here, because logically it can never be None
            let tree_value = self.data[index].value.as_ref().unwrap();
            match value.cmp(&tree_value) {
                std::cmp::Ordering::Less => {
                    index = Self::get_left_child_index(index);
                }
                std::cmp::Ordering::Equal => {
                    return None;
                }
                std::cmp::Ordering::Greater => {
                    index = Self::get_right_child_index(index);
                }
            }

            if (index >= self.data.len()) {
                break;
            }
        }
        Some(index)
    }

    fn get_left_child_index(parent_index: usize) -> usize {
        2 * parent_index + 1
    }

    fn get_right_child_index(parent_index: usize) -> usize {
        2 * parent_index + 2
    }
}
