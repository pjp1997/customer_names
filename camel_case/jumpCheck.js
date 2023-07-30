// jumpCheck.js
function canJumpToEnd(nums) {
    let farthest = 0;
    for (let i = 0; i < nums.length; i++) {
      if (i > farthest) {
        return false;
      }
      farthest = Math.max(farthest, i + nums[i]);
    }
    return farthest >= nums.length - 1;
  }
  
  module.exports = canJumpToEnd;
  