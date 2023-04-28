package Engines

import Abstract.BoardGame

import java.awt.{BorderLayout, Color, Font, GridLayout}
import javax.swing.{BorderFactory, JFrame, JLabel, JPanel, JTextField, SwingConstants}

class TicTacToeEngine extends BoardGame {

  override var rows: Int = 3
  override var cols: Int = 3
  horizontalIndexes =  HorizontalIndex(cols)
  verticalIndexes =  VerticalIndex(rows)
  var firstPlayerTurn: Boolean = true

  def drawer(panel: JPanel, frame: JFrame): Unit = {
    board = new JPanel()
    board.setLayout(new GridLayout(rows, cols))

    val labels = (1 to rows * cols).map(_ => {
      val jLabel = new JLabel("", SwingConstants.CENTER)
      jLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK, 5))
      jLabel.setFont(new Font(Font.DIALOG, Font.BOLD, 75))
      jLabel
    })
    labels.foreach(board.add)
    firstPlayerTurn = true
    frame.add(horizontalIndexes.jPanel, BorderLayout.NORTH)
    panel.add(horizontalIndexes.copy().jPanel, 0)
    frame.add(verticalIndexes.jPanel, BorderLayout.WEST)
    frame.add(verticalIndexes.copy().jPanel, BorderLayout.EAST)
    frame.add(board, BorderLayout.CENTER)
    frame.revalidate()
  }
  def controller(textField: JTextField, frame: JFrame): Unit = {
    val input = textField.getText
    if (
      input.length() != 2
        || !horizontalIndexes.range.contains(input.charAt(0))
        || !verticalIndexes.range.contains(input.charAt(1) - 48)
    ) {
      errorMessage("invalid input", frame)
    }
    val index: Int =
      cols * ((rows - 1) - (input.charAt(1) - 49)) + (input.charAt(0) - 65)
    if (board.getComponent(index).asInstanceOf[JLabel].getText != "") {
      return
    }
    board
      .getComponent(index)
      .asInstanceOf[JLabel]
      .setText(if (firstPlayerTurn) "X" else "O")
    textField.setText("")
    firstPlayerTurn = !firstPlayerTurn
  }


}




