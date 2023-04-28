package Engines

import Abstract.BoardGame

import java.awt.{BorderLayout, Color, Font, GridLayout}
import javax.swing._
import scala.annotation.{tailrec, unused}
import scala.util.Random

class SudokuEngine extends BoardGame {

  override var rows: Int = 9
  override var cols: Int = 9
  var boardGame = Array.ofDim[Int](rows, cols)
  val boardSize = 9
  val blockSize = 3
  horizontalIndexes = new HorizontalIndex(cols)
  verticalIndexes = new VerticalIndex(rows)

  def drawer(panel: JPanel, frame: JFrame): Unit = {
    board = new JPanel()
    val random = generate().flatten
    board.setLayout(new GridLayout(rows, cols))

    val labels = (1 to rows * cols).map(i => {
      val jLabel = new JLabel("", SwingConstants.CENTER)
      if ((i > 18 && i < 28) || (i > 45 && i < 55)) {
        jLabel.setBorder(BorderFactory.createMatteBorder(1, 1, 5, 1, Color.BLACK))
        if (i % 3 == 0) {
          jLabel.setBorder(BorderFactory.createMatteBorder(1, 1, 5, 5, Color.BLACK))
        }
      }
      else {
        if (i % 3 == 0) {
          jLabel.setBorder(BorderFactory.createMatteBorder(1, 1, 1, 5, Color.BLACK))
        }
        else jLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK, 1))
      }

      jLabel.setFont(new Font(Font.DIALOG, Font.BOLD, 25))
      if (random(i - 1) != 0) jLabel.setText(random(i - 1).toString)
      else {
        jLabel.setText("")
        jLabel.setBackground(Color.YELLOW)
      }
      jLabel
    })
    labels.foreach(board.add)
    frame.add(horizontalIndexes.jPanel, BorderLayout.NORTH)
    panel.add(horizontalIndexes.copy().jPanel, 0)
    frame.add(verticalIndexes.jPanel, BorderLayout.WEST)
    frame.add(verticalIndexes.copy().jPanel, BorderLayout.EAST)
    frame.add(board, BorderLayout.CENTER)
    frame.revalidate()
  }

  def controller(textField: JTextField, frame: JFrame): Unit = {
    val input = textField.getText
    print("real",boardGame(rows-(input.charAt(1) - 48))(input.charAt(0) - 65))
    if (
      input.length() != 3
        || !horizontalIndexes.range.contains(input.charAt(0))
        || !verticalIndexes.range.contains(input.charAt(1) - 48)
        || !Seq('1', '2', '3', '4', '5', '6', '7', '8', '9').contains(input.charAt(2))
        || !board.getComponent((input.charAt(0) - 65) + (rows - (input.charAt(1) - 48)) * cols).asInstanceOf[JLabel].getText.equals("")
        || !boardGame(rows-(input.charAt(1) - 48))(input.charAt(0) - 65).equals(input.charAt(2) - 48)
    ) {
      errorMessage("invalid input", frame)
      return
    }
    val row = rows - (input.charAt(1) - 48)
    val col = input.charAt(0) - 65
    val value = input.charAt(2)
    board
      .getComponent(col + row * cols)
      .asInstanceOf[JLabel]
      .setText(value.toString)
    textField.setText("")
  }

  def generate(): Array[Array[Int]] = {
    val board = Array.fill(boardSize, boardSize)(0)
    fillDiagonalBlocks(board)
    fillRemainingCells(board, 0, blockSize)
    boardGame= board.map(_.clone)
    eraseCells(board, 0, blockSize)
    board
  }

  private def fillDiagonalBlocks(board: Array[Array[Int]]): Unit = {
    for (i <- 0 until boardSize by blockSize) {
      fillBlock(board, i, i)
    }
  }

  @tailrec
  private def eraseCells(board: Array[Array[Int]], row: Int, col: Int): Unit = {
    if (col == boardSize) {
      eraseCells(board, row + 1, 0)
    } else if (row == boardSize) {
      return
    } else {
      val random = Random.nextInt(2)
      if (random == 0) {
        board(row)(col) = 0
      }
      eraseCells(board, row, col + 1)
    }
  }

  private def fillBlock(board: Array[Array[Int]], row: Int, col: Int): Unit = {
    val values = Random.shuffle((1 to boardSize).toList)
    var index = 0
    for (i <- row until row + blockSize) {
      for (j <- col until col + blockSize) {
        board(i)(j) = values(index)
        index += 1
      }
    }
  }

  private def fillRemainingCells(board: Array[Array[Int]], row: Int, col: Int): Boolean = {
    if (col == boardSize) {
      fillRemainingCells(board, row + 1, 0)
    } else if (row == boardSize) {
      true
    } else if (board(row)(col) != 0) {
      fillRemainingCells(board, row, col + 1)
    } else {
      val values = Random.shuffle((1 to boardSize).toList)
      values.exists { value =>
        if (isValid(board, row, col, value)) {
          board(row)(col) = value
          if (fillRemainingCells(board, row, col + 1)) {
            true
          } else {
            board(row)(col) = 0
            false
          }
        } else {
          false
        }
      }
    }
  }

  private def isValid(board: Array[Array[Int]], row: Int, col: Int, value: Int): Boolean = {
    !usedInRow(board, row, value) &&
      !usedInCol(board, col, value) &&
      !usedInBlock(board, row - row % blockSize, col - col % blockSize, value)
  }

  private def usedInRow(board: Array[Array[Int]], row: Int, value: Int): Boolean = {
    board(row).contains(value)
  }

  private def usedInCol(board: Array[Array[Int]], col: Int, value: Int): Boolean = {
    board.exists(row => row(col) == value)
  }

  private def usedInBlock(board: Array[Array[Int]], blockStartRow: Int, blockStartCol: Int, value: Int): Boolean = {
    val blockEndRow = blockStartRow + blockSize - 1
    val blockEndCol = blockStartCol + blockSize - 1
    for (i <- blockStartRow to blockEndRow) {
      for (j <- blockStartCol to blockEndCol) {
        if (board(i)(j) == value) {
          return true
        }
      }
    }
    false
  }

}
