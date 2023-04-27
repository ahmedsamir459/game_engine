package Abstract

import javax.swing.{JLabel, JPanel, SwingConstants}

trait Index {
  val jPanel: JPanel
  val range: Seq[_]
  def createLabel(value: Any): JLabel = new JLabel(value.toString, SwingConstants.CENTER)
}