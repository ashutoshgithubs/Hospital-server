const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(bodyParser.json());
const user = [
  {
    name: "Ashutosh",
    kidney: [
      {
        healthy: false,
      },
      {
        healthy: true,
      },
    ],
  },
  {
    name: "Ramu",
    kidney: [
      {
        healthy: true,
      },
    ],
  },
];

//Need to return totalKidney, healthyKidney, and unhealthyKidney
app.get("/", (req, res) => {
  let totalKidney = 0;
  for (let i = 0; i < user.length; i++) {
    totalKidney = totalKidney + user[i].kidney.length;
  }

  let healthyKidney = 0;
  for (let i = 0; i < user.length; i++) {
    for (let j = 0; j < user[i].kidney.length; j++) {
      if (user[i].kidney[j].healthy) {
        healthyKidney = healthyKidney + 1;
      }
    }
  }

  let unhealthyKidney = totalKidney - healthyKidney;

  res.status(200).json({
    totalKidney,
    healthyKidney,
    unhealthyKidney,
  });
});

app.post("/posting", (req, res) => {
  const healthy = req.body.healthy;
  user[0].kidney.push({
    healthy: healthy,
  });
  res.status(200).json({
    success: true,
    message: "Posting done!",
  });
});

//Now update unhealthy with healthy Kidney
// **********Observation********
// ◊ Updation will be done when there exists atleast one unhealthy Kidney

// ------> Let's apply the put request <-------

app.put("/update", (req, res) => {
  let unhealthyKidney = 0;
  for (let i = 0; i < user.length; i++) {
    for (let j = 0; j < user[i].kidney.length; j++) {
      if (!user[i].kidney[j].healthy) {
        unhealthyKidney = unhealthyKidney + 1;
      }
    }
  }
  if (unhealthyKidney > 0) {
    for (let i = 0; i < user.length; i++) {
      for (let j = 0; j < user[i].kidney.length; j++) {
        if (user[i].kidney[j].healthy === false) {
          user[i].kidney[j].healthy = true;
        }
      }
    }
  } else {
    return res.status(411).json({
      success: false,
      message: "Can't be updated due to zero unhealthy kidney",
    });
  }
  res.status(200).json({
    success: true,
    message: "Updated!",
  });
});

// ** Let's delete all unhealthy kidney from the user*
// **********Observation********
// ◊ Updation will be done when there exists atleast one unhealthy Kidney

app.delete("/delete", (req, res) => {
  //Pick all healthy kidney and push them into newHealthObj

  let unhealthyKidney = 0;
  for (let i = 0; i < user.length; i++) {
    for (let j = 0; j < user[i].kidney.length; j++) {
      if (!user[i].kidney[j].healthy) {
        unhealthyKidney = unhealthyKidney + 1;
      }
    }
  }
  if (unhealthyKidney > 0) {
    for (let i = 0; i < user.length; i++) {
      const newHealthObj = [];
      for (let j = 0; j < user[i].kidney.length; j++) {
        if (user[i].kidney[j].healthy) {
          newHealthObj.push({
            healthy: true,
          });
        }
      }
      user[i].kidney = newHealthObj;
    }
  } else {
    return res.status(411).json({
      success: false,
      message: "Deletion failed due to absence of unhealthy kidney",
    });
  }
  res.status(200).json({
    success: true,
    message: "Deletion successful",
  });
});

app.listen(port, () => {
  console.log("Server is okay!");
});
