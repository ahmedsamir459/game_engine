package Engines

import Abstract.Index

import java.awt.GridLayout
import javax.swing.border.EmptyBorder
import javax.swing.JPanel
import scala.collection.immutable.NumericRange

case class HorizontalIndex(cols: Int) extends Index {
  override val range: NumericRange.Inclusive[Char] = 'A' to ('A'.toInt + cols - 1).toChar
  override val jPanel: JPanel = {
    val panel = new JPanel()
    panel.setLayout(new GridLayout(1, cols))
    panel.setBorder(new EmptyBorder(10, 10, 10, 10))
    range.map(i => {
      panel.add(createLabel(i))
    })
    panel
  }
}

case class VerticalIndex(rows: Int) extends Index {
  override val range: Range = rows to 1 by -1
  override val jPanel: JPanel = {
    val panel = new JPanel()
    panel.setLayout(new GridLayout(rows, 1))
    panel.setBorder(new EmptyBorder(10, 10, 10, 10))
    range.map(i => {
      panel.add(createLabel(i))
    })
    panel
  }
}
