package Abstract

import Engines.{HorizontalIndex, VerticalIndex}

import java.awt.FlowLayout
import javax.swing.{JFrame, JOptionPane, JPanel, JTextField}

trait BoardGame {
  var rows: Int
  var cols: Int
  var horizontalIndexes: HorizontalIndex = null
  var verticalIndexes: VerticalIndex = null
  var board: JPanel = null
  def drawer(panel: JPanel, frame: JFrame): Unit

  def controller(textField: JTextField, frame: JFrame): Unit
  def getController: (JTextField, JFrame) => Unit = return this.controller
  def getDrawer: (JPanel, JFrame) => Unit = return this.drawer

  def errorMessage(message: String, frame: JFrame): Unit = {
    val panel = new JPanel
    val layout = new FlowLayout
    panel.setLayout(layout)
    JOptionPane.showMessageDialog(frame, message,
      "Error", JOptionPane.WARNING_MESSAGE)
  }
}
