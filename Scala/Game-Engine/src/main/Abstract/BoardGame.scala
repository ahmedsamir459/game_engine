package Abstract

import Engines.{HorizontalIndex, VerticalIndex}

import javax.swing.{JFrame, JPanel, JTextField}

trait BoardGame {
  var rows: Int
  var cols: Int
  var horizontalIndexes: HorizontalIndex = null
  var verticalIndexes: VerticalIndex = null
  def drawer(panel: JPanel, frame: JFrame): Unit

  def controller(textField: JTextField, frame: JFrame): Unit
  def getController: (JTextField, JFrame) => Unit = return this.controller
  def getDrawer: (JPanel, JFrame) => Unit = return this.drawer
}
