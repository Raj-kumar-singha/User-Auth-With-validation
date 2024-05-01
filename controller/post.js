const post = require("../models/post");

let Modules = function () {
  //Create Post: -
  this.createPost = async (req, res) => {
    const postData = new post({ ...req.body, createdBy: req.user._id });
    try {
      await postData.save();
      res.status(200).send({
        success: true,
        message: "Created Post successfully",
      });
    } catch (err) {
      res.status(400).send({
        success: false,
        error: err.message,
      });
    }
  };

  //GET All Post: -
  this.findAllPost = async (req, res) => {
    try {
      const postData = await post
        .find()
        .populate({ path: "createdBy", select: "name email -_id" });
      res.status(200).send({totalPost: postData.length , posts : postData});
    } catch (err) {
      res.status(400).send({
        success: false,
        error: err.message,
      });
    }
  };

  //Update post: -
  this.updateById = async (req, res) => {
    try {
      const Post = await post.findById(req.params.id);
      if (!Post) {
        return res
          .status(404)
          .send({ success: false, message: "Post not found" });
      }

      if (Post.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).send({
          success: false,
          message: "Unauthorized. You can only update your own posts.",
        });
      }
      const updatedPost = await post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "Updated data successfully",
        data: updatedPost,
      });
    } catch (err) {
      res.status(400).send({
        success: false,
        error: "Error updating post data",
        message: err.message,
      });
    }
  };

  //Delete Post: -
  this.deleteById = async (req, res) => {
    try {
      const Post = await post.findById(req.params.id);
      if (!Post) {
        return res
          .status(404)
          .send({ success: false, message: "Post not found" });
      }

      if (Post.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).send({
          success: false,
          message: "Unauthorized. You can only delete your own posts.",
        });
      }

      const deletedPost = await post.findByIdAndDelete(req.params.id);
      if (!deletedPost) {
        return res
          .status(404)
          .send({ success: false, message: "Post not found" });
      }

      res
        .status(200)
        .send({ success: true, message: "Deleted data successfully" });
    } catch (err) {
      res.status(400).send({
        success: false,
        error: "Error deleting post data",
        message: err.message,
      });
    }
  };

  // get data by lat and long : -
  this.getPostByLocation = async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      const posts = await post
        .find({
          'geoLocation.coordinates': [Number(latitude), Number(longitude)]
        })
        .populate({ path: "createdBy", select: "name email -_id" })
      .then(posts => {
        if(posts.length === 0){
          return res.status(404).send({
            success: false,
            message: "No posts found in this location"
          })
        }
        res.status(200).send({
          noOfPost: posts.length,
          posts : posts
        })
      })
      .catch((err)=> {
        res.status(400).send({ message: err.message });
      })
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  //Fetching Dash board data : -
  this.dashboard = async (req, res) => {
    try {
      const activePosts = await post
        .find({ status: "Active" })
        .populate({ path: "createdBy", select: "name email -_id" });
      const inactivePosts = await post
        .find({ status: "Inactive" })
        .populate({ path: "createdBy", select: "name email -_id" });
      const activeCount = activePosts.length;
      const inactiveCount = inactivePosts.length;
      res
        .status(200)
        .json({ activeCount, inactiveCount, activePosts, inactivePosts });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
};
module.exports = new Modules();
