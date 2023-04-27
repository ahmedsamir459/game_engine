package scala
import java.awt.{BorderLayout, GridLayout}
import javax.swing.{JFrame, JPanel, JTextField}

//class BoardGameEngine(frame: JFrame, controller : (JTextField, JFrame) => Unit, drawer : (JPanel, JFrame) => Unit) {
//  val southPanel : JPanel = new JPanel(new GridLayout(2, 1))
//  val textField: JTextField = new JTextField()
//  southPanel.add(textField)
//  frame.add(southPanel, BorderLayout.SOUTH)
//  this.drawer(southPanel, frame)
//  textField.addActionListener(_ => controller(textField, frame))
//}


import java.awt.{BorderLayout, GridLayout}
import javax.swing.{JFrame, JPanel, JTextField}

case class BoardGameEngine(frame: JFrame, controller : (JTextField, JFrame) => Unit, drawer : (JPanel, JFrame) => Unit) {
  val southPanel: JPanel = new JPanel(new GridLayout(2, 1))
  val textField: JTextField = new JTextField()

  def setupUI(): Unit = {
    southPanel.add(textField)
    frame.add(southPanel, BorderLayout.SOUTH)
    drawer(southPanel, frame)
    textField.addActionListener(_ => controller(textField, frame))
  }

  setupUI()
}

