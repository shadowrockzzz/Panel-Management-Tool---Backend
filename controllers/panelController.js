import User from "../model/user.js";

const getPanelData = async (req, res) => {
  const { userName, token } = req.query;

  if (!userName) {
    res.status(404).send("Unable to get the userName");
  }

  try {
    let data = await User.findOne({ userName: userName });

    if (!data) {
      res.status(404).send("Unable to find the specific member");
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(404).send("Unable to find the member in database");
  }
};

const getAllPanels = async (req, res) => {
  try {
    const panels = await User.find({});

    if (panels.length == 0) {
      res.status(404).send("No panels present");
    } else {
      res.status(200).send(panels);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Database Error");
  }
};

export default { getPanelData, getAllPanels };
