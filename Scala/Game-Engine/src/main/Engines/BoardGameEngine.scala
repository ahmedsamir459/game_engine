package Engines

import java.awt.{BorderLayout, GridLayout}
import javax.swing.{JFrame, JPanel, JTextField}


case class BoardGameEngine(frame: JFrame, controller : (JTextField, JFrame) => Unit, drawer : (JPanel, JFrame) => Unit) {
  def setupUI(): Unit = {
    val panel: JPanel = new JPanel(new GridLayout(2, 1))
    val textField: JTextField = new JTextField()
    panel.add(textField)
    frame.add(panel, BorderLayout.SOUTH)
    drawer(panel, frame)
    textField.addActionListener(_ => controller(textField, frame))
  }

  setupUI()
}

