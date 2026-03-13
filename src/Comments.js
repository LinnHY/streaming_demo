/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useData } from "./data";
import React from "react";

export default function Comments() {
  const comments = useData();
  const expandedState = React.useState(null);
  const expandedIndex = expandedState[0];
  const setExpandedIndex = expandedState[1];
  const likedState = React.useState(new Set());
  const likedComments = likedState[0];
  const setLikedComments = likedState[1];

  function handleLike(i, e) {
    e.stopPropagation();
    setLikedComments(function(prev) {
      const newSet = new Set(prev);
      if (newSet.has(i)) {
        newSet.delete(i);
      } else {
        newSet.add(i);
      }
      return newSet;
    });
  }

  function handleCommentClick(i) {
    setExpandedIndex(expandedIndex === i ? null : i);
  }

  function handleMouseEnter(e) {
    e.currentTarget.style.backgroundColor = "#f0f8ff";
  }

  function handleMouseLeave(e) {
    e.currentTarget.style.backgroundColor = "";
  }

  return React.createElement(
    React.Fragment,
    null,
    comments.map(function(comment, i) {
      const isExpanded = expandedIndex === i;
      const isLiked = likedComments.has(i);
      return React.createElement(
        "div",
        {
          className: "comment " + (isExpanded ? "expanded" : ""),
          key: i,
          onClick: function() { handleCommentClick(i); },
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave
        },
        React.createElement("p", null, comment),
        React.createElement(
          "button",
          {
            className: "like-btn " + (isLiked ? "liked" : ""),
            onClick: function(e) { handleLike(i, e); }
          },
          isLiked ? "❤️ 已赞" : "🤍 点赞"
        ),
        isExpanded && React.createElement(
          "div",
          { className: "comment-detail" },
          React.createElement("small", null, "评论 #" + (i + 1) + " · 点击收起")
        )
      );
    })
  );
}
